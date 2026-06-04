import { reactive, ref, computed, watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/entities/cart'
import { useUserStore } from '@/entities/user'
import { useAddressStore } from '@/entities/address'
import { useCardStore } from '@/entities/card'
import { useOrderStore, type OrderItem } from '@/entities/order'
import { useBranchStore } from '@/entities/branch'
import type { FulfillmentMode, ZoneInfo, PromoResult } from './types'
import {
  defaultDraft,
  fillFromAddress,
  clearAddress,
  validate,
  buildPayload,
  type DraftErrors,
} from './checkoutDraft'
import { computeTotals, computeTip, clampBonus, maxBonus } from './checkoutTotals'
import { detectZone } from '../api/zoneApi'
import { applyPromo } from '../api/promoApi'
import { DEFAULT_ETA_MINUTES, PICKUP_ETA_MINUTES } from '../config/checkout'

const PICKUP_ZONE: ZoneInfo = { type: 'free', deliveryCost: 0, minOrder: 0, etaMinutes: PICKUP_ETA_MINUTES }

export function useCheckout() {
  const cart = useCartStore()
  const userStore = useUserStore()
  const addressStore = useAddressStore()
  const cardStore = useCardStore()
  const orderStore = useOrderStore()
  const branchStore = useBranchStore()
  const { placing } = storeToRefs(orderStore)

  const draft = reactive(defaultDraft())
  const errors = ref<DraftErrors>({})

  // delivery-only zone (from address detection)
  const deliveryZone = ref<ZoneInfo | null>(null)
  const zoneLoading = ref(false)

  // effective zone depends on mode
  const zone = computed<ZoneInfo | null>(() => {
    if (draft.fulfillmentMode === 'pickup') {
      return draft.pickupBranchId ? PICKUP_ZONE : null
    }
    return deliveryZone.value
  })

  const promo = ref<PromoResult | null>(null)
  const promoError = ref<string | null>(null)
  const promoLoading = ref(false)

  const bonusBalance = computed(() => userStore.user?.bonusBalance ?? 0)
  const subtotal = computed(() => cart.total)

  const items = computed<OrderItem[]>(() =>
    cart.items.map((i) => ({
      menuItemId: i.menuItemId,
      productId: i.productId,
      productName: i.productName,
      variantName: i.variantName,
      price: i.price,
      quantity: i.quantity,
      image: i.image,
    })),
  )

  const maxBonusValue = computed(() => maxBonus(subtotal.value, bonusBalance.value))
  const tip = computed(() => computeTip(draft, subtotal.value))
  const promoDiscount = computed(() => promo.value?.discount ?? 0)

  const totals = computed(() =>
    computeTotals({
      subtotal: subtotal.value,
      zone: zone.value,
      promoDiscount: promoDiscount.value,
      bonusUsed: clampBonus(draft.bonusToUse, subtotal.value, bonusBalance.value),
      tip: tip.value,
    }),
  )

  const etaMinutes = computed(() => zone.value?.etaMinutes ?? DEFAULT_ETA_MINUTES)
  const isZoneUnavailable = computed(() => zone.value?.type === 'none')
  const isBelowMinOrder = computed(
    () =>
      zone.value !== null &&
      zone.value.type !== 'none' &&
      subtotal.value < zone.value.minOrder,
  )

  const canSubmit = computed(
    () =>
      !cart.isEmpty &&
      zone.value !== null &&
      !isZoneUnavailable.value &&
      !isBelowMinOrder.value &&
      !zoneLoading.value &&
      !placing.value &&
      Object.keys(validate(draft)).length === 0,
  )

  // --- зона доставки: автоопределение по адресу (debounce) ---
  let zoneTimer: ReturnType<typeof setTimeout> | undefined

  watch(
    () => [draft.street, draft.house] as const,
    ([street, house]) => {
      if (draft.fulfillmentMode !== 'delivery') return
      clearTimeout(zoneTimer)
      if (!street.trim() || !house.trim()) {
        deliveryZone.value = null
        return
      }
      zoneLoading.value = true
      zoneTimer = setTimeout(async () => {
        try {
          deliveryZone.value = await detectZone(street, house)
        } finally {
          zoneLoading.value = false
        }
      }, 500)
    },
  )

  onUnmounted(() => clearTimeout(zoneTimer))

  watch([subtotal, bonusBalance, () => draft.bonusToUse], () => {
    const clamped = clampBonus(draft.bonusToUse, subtotal.value, bonusBalance.value)
    if (clamped !== draft.bonusToUse) draft.bonusToUse = clamped
  })

  // --- режим доставки ---
  function setMode(mode: FulfillmentMode): void {
    draft.fulfillmentMode = mode
    errors.value = {}
  }

  // --- адрес ---
  function selectSavedAddress(id: string): void {
    const addr = addressStore.list.find((a) => a.id === id)
    if (addr) fillFromAddress(draft, addr)
  }

  function useNewAddress(): void {
    clearAddress(draft)
    deliveryZone.value = null
  }

  // --- точка самовывоза ---
  function selectBranch(branchId: string): void {
    draft.pickupBranchId = branchId
    errors.value = {}
  }

  // --- промокод ---
  async function submitPromo(): Promise<void> {
    promoError.value = null
    if (!draft.promoInput.trim()) return
    promoLoading.value = true
    try {
      promo.value = await applyPromo(draft.promoInput, subtotal.value)
    } catch (e) {
      promo.value = null
      promoError.value = (e as { message?: string }).message ?? 'Промокод не найден'
    } finally {
      promoLoading.value = false
    }
  }

  function removePromo(): void {
    promo.value = null
    promoError.value = null
    draft.promoInput = ''
  }

  // --- чаевые ---
  function setTipPercent(pct: number): void {
    draft.tipMode = 'percent'
    draft.tipPercent = pct
  }
  function setTipNone(): void { draft.tipMode = 'none' }
  function setTipCustom(): void { draft.tipMode = 'custom' }

  async function init(): Promise<void> {
    await Promise.all([addressStore.fetchAll(), cardStore.fetchAll(), branchStore.fetchAll()])
    const primary = addressStore.primary
    if (primary) selectSavedAddress(primary.id)
    const primaryCard = cardStore.primary
    if (primaryCard) draft.savedCardId = primaryCard.id
  }

  async function submit(): Promise<boolean> {
    errors.value = validate(draft)
    if (!canSubmit.value) return false
    const selectedBranch = draft.pickupBranchId
      ? branchStore.getById(draft.pickupBranchId)
      : undefined
    const payload = buildPayload({
      draft,
      items: items.value,
      totals: totals.value,
      promoCode: promo.value?.code ?? null,
      etaMinutes: etaMinutes.value,
      branchAddress: selectedBranch?.address,
    })
    try {
      await orderStore.place(payload)
      cart.clearCart()
      return true
    } catch {
      return false
    }
  }

  return {
    draft,
    errors,
    zone,
    zoneLoading,
    isZoneUnavailable,
    isBelowMinOrder,
    promo,
    promoError,
    promoLoading,
    bonusBalance,
    maxBonusValue,
    subtotal,
    totals,
    tip,
    etaMinutes,
    placing,
    canSubmit,
    branches: computed(() => branchStore.activeBranches),
    branchesLoading: computed(() => branchStore.loading),
    savedAddresses: computed(() => addressStore.list),
    addressesLoading: computed(() => addressStore.loading),
    savedCards: computed(() => cardStore.list),
    cardsLoading: computed(() => cardStore.loading),
    init,
    setMode,
    selectSavedAddress,
    useNewAddress,
    selectBranch,
    submitPromo,
    removePromo,
    setTipPercent,
    setTipNone,
    setTipCustom,
    submit,
  }
}
