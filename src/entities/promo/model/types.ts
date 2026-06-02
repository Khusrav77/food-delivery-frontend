export type PromoDiscountType = 'percent' | 'fixed'

export interface IPromoCode {
  id: string
  code: string
  type: PromoDiscountType
  value: number
  minOrder: number
  expiresAt: string | null
  description: string
}
