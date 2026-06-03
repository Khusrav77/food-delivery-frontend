export { useAdminPromoStore } from './model/adminPromoStore'
export { usePromoStore } from './model/store'
export type {
  IPromoCode,
  IPromoCodeDraft,
  IPromoCodeDraftErrors,
  PromoDiscountType,
} from './model/types'
export { defaultDraft, validateDraft } from './model/types'
export { computeDiscount } from './lib/discount'
export { fetchPromoCodes, applyPromoCode } from './api/promoApi'
export type { PromoApplyResult } from './api/promoApi'
export { default as PromoCard } from './ui/PromoCard.vue'
