import type { PromoResult } from '../model/types'
import { applyPromoCode } from '@/entities/promo'

export async function applyPromo(code: string, subtotal: number): Promise<PromoResult> {
  return applyPromoCode(code, subtotal)
}
