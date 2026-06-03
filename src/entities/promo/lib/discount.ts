import type { IPromoCode } from '../model/types'

export function computeDiscount(promo: IPromoCode, subtotal: number): number {
  if (promo.type === 'percent') return Math.round(subtotal * promo.value)
  return Math.min(promo.value, subtotal)
}
