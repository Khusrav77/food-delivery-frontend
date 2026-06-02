import type { CheckoutDraft, ZoneInfo, TotalsBreakdown } from './types'
import { MAX_BONUS_PCT } from '../config/checkout'

/** Максимум бонусов к списанию: не больше баланса и не больше MAX_BONUS_PCT от суммы товаров. */
export function maxBonus(subtotal: number, balance: number): number {
  return Math.max(0, Math.min(balance, Math.floor(subtotal * MAX_BONUS_PCT)))
}

/** Приводит введённое количество бонусов в допустимый диапазон [0, maxBonus]. */
export function clampBonus(value: number, subtotal: number, balance: number): number {
  if (Number.isNaN(value) || value < 0) return 0
  return Math.min(Math.floor(value), maxBonus(subtotal, balance))
}

/** Сумма чаевых из режима, выбранного в форме. */
export function computeTip(draft: CheckoutDraft, subtotal: number): number {
  if (draft.tipMode === 'percent') return Math.round(subtotal * draft.tipPercent)
  if (draft.tipMode === 'custom') return Math.max(0, Math.floor(draft.tipCustom) || 0)
  return 0
}

export function computeTotals(params: {
  subtotal: number
  zone: ZoneInfo | null
  promoDiscount: number
  bonusUsed: number
  tip: number
}): TotalsBreakdown {
  const { subtotal, zone, promoDiscount, bonusUsed, tip } = params
  const deliveryCost = zone?.type === 'paid' ? zone.deliveryCost : 0
  const total = Math.max(0, subtotal + deliveryCost - promoDiscount - bonusUsed + tip)
  return { subtotal, deliveryCost, promoDiscount, bonusUsed, tip, total }
}
