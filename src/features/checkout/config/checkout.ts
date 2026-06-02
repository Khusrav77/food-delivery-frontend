import type { PaymentMethod } from '@/entities/order'

// максимальная доля суммы товаров, которую можно оплатить бонусами (ТЗ §2.8)
export const MAX_BONUS_PCT = 0.5

export const DEFAULT_ETA_MINUTES = 45

// доступные пресеты чаевых в процентах от суммы товаров
export const TIP_PERCENTS = [0.05, 0.1] as const

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cash: 'Наличными курьеру',
  card: 'Банковской картой',
  sbp: 'СБП / Быстрые платежи',
}
