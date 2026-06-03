import type { CheckoutDraft, TotalsBreakdown } from './types'
import type { IAddress } from '@/entities/address'
import type { PlaceOrderPayload, OrderItem } from '@/entities/order'

export function defaultDraft(): CheckoutDraft {
  return {
    savedAddressId: null,
    label: 'home',
    street: '',
    house: '',
    apartment: '',
    entrance: '',
    floor: '',
    addressComment: '',
    orderComment: '',
    paymentMethod: 'cash',
    savedCardId: null,
    promoInput: '',
    bonusToUse: 0,
    tipMode: 'none',
    tipPercent: 0.05,
    tipCustom: 0,
    leaveAtDoor: false,
  }
}

/** Переносит данные сохранённого адреса в черновик (мутирует переданный reactive-объект). */
export function fillFromAddress(draft: CheckoutDraft, addr: IAddress): void {
  draft.savedAddressId = addr.id
  draft.label = addr.label
  draft.street = addr.street
  draft.house = addr.house
  draft.apartment = addr.apartment
  draft.entrance = addr.entrance
  draft.floor = addr.floor
  draft.addressComment = addr.comment
}

/** Очищает поля адреса для ручного ввода. */
export function clearAddress(draft: CheckoutDraft): void {
  draft.savedAddressId = null
  draft.street = ''
  draft.house = ''
  draft.apartment = ''
  draft.entrance = ''
  draft.floor = ''
  draft.addressComment = ''
}

export interface DraftErrors {
  street?: string
  house?: string
}

export function validate(draft: CheckoutDraft): DraftErrors {
  const errors: DraftErrors = {}
  if (!draft.street.trim()) errors.street = 'Укажите улицу'
  if (!draft.house.trim()) errors.house = 'Укажите дом'
  return errors
}

export function formatAddress(draft: CheckoutDraft): string {
  const parts = [
    `${draft.street}, д. ${draft.house}`,
    draft.apartment && `кв. ${draft.apartment}`,
    draft.entrance && `подъезд ${draft.entrance}`,
    draft.floor && `этаж ${draft.floor}`,
  ].filter(Boolean)
  return parts.join(', ')
}

export function buildPayload(p: {
  draft: CheckoutDraft
  items: OrderItem[]
  totals: TotalsBreakdown
  promoCode: string | null
  etaMinutes: number
}): PlaceOrderPayload {
  return {
    items: p.items,
    address: formatAddress(p.draft),
    comment: p.draft.orderComment,
    leaveAtDoor: p.draft.leaveAtDoor,
    paymentMethod: p.draft.paymentMethod,
    promoCode: p.promoCode,
    bonusUsed: p.totals.bonusUsed,
    tip: p.totals.tip,
    subtotal: p.totals.subtotal,
    deliveryCost: p.totals.deliveryCost,
    promoDiscount: p.totals.promoDiscount,
    total: p.totals.total,
    etaMinutes: p.etaMinutes,
  }
}
