import type { PromoResult } from '../model/types'

const PROMOS: Record<string, (subtotal: number) => number> = {
  WELCOME: (s) => Math.round(s * 0.1), // −10%
  FIX200: () => 200, // −200 ₽
}

// MOCK: эндпоинта промокодов ещё нет (админ-промокоды §2.7 не построены).
// Заменить на: const res = await http.post<PromoResult>('/promo/apply', { code, subtotal }); return res.data
export async function applyPromo(code: string, subtotal: number): Promise<PromoResult> {
  await new Promise((r) => setTimeout(r, 400))
  const key = code.trim().toUpperCase()
  const calc = PROMOS[key]
  if (!calc) {
    return Promise.reject({ code: 'PROMO_INVALID', message: 'Промокод не найден' })
  }
  return { code: key, discount: Math.min(calc(subtotal), subtotal) }
}
