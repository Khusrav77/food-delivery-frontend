import type { IPromoCode } from '../model/types'
import { computeDiscount } from '../lib/discount'

const PROMO_DB: IPromoCode[] = [
  {
    id: 'promo-1',
    code: 'WELCOME',
    type: 'percent',
    value: 0.1,
    minOrder: 0,
    expiresAt: null,
    description: 'Скидка 10% на первый заказ',
  },
  {
    id: 'promo-2',
    code: 'FIX200',
    type: 'fixed',
    value: 200,
    minOrder: 800,
    expiresAt: '2026-12-31T23:59:59Z',
    description: 'Скидка 200 ₽ при заказе от 800 ₽',
  },
]

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

// MOCK: GET /promo-codes
export async function fetchPromoCodes(): Promise<IPromoCode[]> {
  await delay(300)
  return PROMO_DB.map((p) => ({ ...p }))
}

export interface PromoApplyResult {
  code: string
  discount: number
}

// MOCK: POST /promo/apply — заменить на http.post<PromoApplyResult>('/promo/apply', { code, subtotal })
export async function applyPromoCode(code: string, subtotal: number): Promise<PromoApplyResult> {
  await delay(400)
  const promo = PROMO_DB.find((p) => p.code === code.trim().toUpperCase())
  if (!promo) return Promise.reject({ code: 'PROMO_INVALID', message: 'Промокод не найден' })
  if (promo.minOrder > subtotal) {
    return Promise.reject({
      code: 'PROMO_MIN_ORDER',
      message: `Минимальная сумма заказа для этого промокода — ${promo.minOrder} ₽`,
    })
  }
  return { code: promo.code, discount: computeDiscount(promo, subtotal) }
}
