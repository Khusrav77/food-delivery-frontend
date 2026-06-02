import { reactive, ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/entities/cart'
import { useUserStore } from '@/entities/user'
import { useAddressStore } from '@/entities/address'
import { useOrderStore, type OrderItem } from '@/entities/order'
import type { ZoneInfo, PromoResult } from './types'
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
import { DEFAULT_ETA_MINUTES } from '../config/checkout'

export function useCheckout() {
  const cart = useCartStore()
  const userStore = useUserStore()
  const addressStore = useAddressStore()
  const orderStore = useOrderStore()
  const { placing } = storeToRefs(orderStore)

  const draft = reactive(defaultDraft())
  const errors = ref<DraftErrors>({})

  const zone = ref<ZoneInfo | null>(null)
  const zoneLoading = ref(false)

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
      clearTimeout(zoneTimer)
      if (!street.trim() || !house.trim()) {
        zone.value = null
        return
      }
      zoneLoading.value = true
      zoneTimer = setTimeout(async () => {
        try {
          zone.value = await detectZone(street, house)
        } finally {
          zoneLoading.value = false
        }
      }, 500)
    },
  )

  // держим введённые бонусы в допустимом диапазоне (при вводе и при изменении суммы/баланса)
  watch([subtotal, bonusBalance, () => draft.bonusToUse], () => {
    const clamped = clampBonus(draft.bonusToUse, subtotal.value, bonusBalance.value)
    if (clamped !== draft.bonusToUse) draft.bonusToUse = clamped
  })

  // --- адрес ---
  function selectSavedAddress(id: string): void {
    const addr = addressStore.list.find((a) => a.id === id)
    if (addr) fillFromAddress(draft, addr)
  }

  function useNewAddress(): void {
    clearAddress(draft)
    zone.value = null
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
  function setTipNone(): void {
    draft.tipMode = 'none'
  }
  function setTipCustom(): void {
    draft.tipMode = 'custom'
  }

  async function init(): Promise<void> {
    await addressStore.fetchAll()
    const primary = addressStore.primary
    if (primary) selectSavedAddress(primary.id)
  }

  async function submit(): Promise<boolean> {
    errors.value = validate(draft)
    if (!canSubmit.value) return false
    const payload = buildPayload({
      draft,
      items: items.value,
      totals: totals.value,
      promoCode: promo.value?.code ?? null,
      etaMinutes: etaMinutes.value,
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
    savedAddresses: computed(() => addressStore.list),
    addressesLoading: computed(() => addressStore.loading),
    init,
    selectSavedAddress,
    useNewAddress,
    submitPromo,
    removePromo,
    setTipPercent,
    setTipNone,
    setTipCustom,
    submit,
  }
}
