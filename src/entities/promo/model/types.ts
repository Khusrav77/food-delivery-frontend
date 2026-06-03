export type PromoDiscountType = 'percent' | 'fixed'

export interface IPromoCode {
  id: string
  code: string
  type: PromoDiscountType
  value: number
  minOrder: number
  expiresAt: string | null
  description: string
  usageLimit: number | null
  usageCount: number
  totalDiscount: number
  isActive: boolean
  createdAt: string
}

export interface IPromoCodeDraft {
  code: string
  type: PromoDiscountType
  value: string
  expiresAt: string
  usageLimit: string
}

export interface IPromoCodeDraftErrors {
  code?: string
  value?: string
}

export function defaultDraft(): IPromoCodeDraft {
  return { code: '', type: 'percent', value: '', expiresAt: '', usageLimit: '' }
}

export function validateDraft(d: IPromoCodeDraft): IPromoCodeDraftErrors {
  const errors: IPromoCodeDraftErrors = {}
  if (!d.code.trim()) errors.code = 'Введите код'
  else if (!/^[A-Z0-9_-]{2,20}$/.test(d.code.trim().toUpperCase())) errors.code = 'Только латиница, цифры, _ и −'
  const v = Number(d.value)
  if (!d.value || isNaN(v) || v <= 0) errors.value = 'Укажите положительное число'
  else if (d.type === 'percent' && v > 100) errors.value = 'Максимум 100%'
  return errors
}
