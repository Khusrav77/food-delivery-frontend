import type { AddressLabel } from '@/entities/address'
import type { PaymentMethod } from '@/entities/order'

export type ZoneType = 'free' | 'paid' | 'none'

export interface ZoneInfo {
  type: ZoneType
  deliveryCost: number
  minOrder: number
  etaMinutes: number
}

export interface PromoResult {
  code: string
  discount: number
}

export type TipMode = 'none' | 'percent' | 'custom'

export interface CheckoutDraft {
  savedAddressId: string | null // null = ввод нового адреса
  label: AddressLabel
  street: string
  house: string
  apartment: string
  entrance: string
  floor: string
  addressComment: string // комментарий курьеру (часть адреса)
  orderComment: string // комментарий к заказу
  paymentMethod: PaymentMethod
  savedCardId: string | null // выбранная сохранённая карта (только при paymentMethod === 'card')
  promoInput: string
  bonusToUse: number
  tipMode: TipMode
  tipPercent: number // 0.05 | 0.1 — когда tipMode === 'percent'
  tipCustom: number // когда tipMode === 'custom'
}

export interface TotalsBreakdown {
  subtotal: number
  deliveryCost: number
  promoDiscount: number
  bonusUsed: number
  tip: number
  total: number
}
