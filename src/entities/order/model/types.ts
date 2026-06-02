export type PaymentMethod = 'cash' | 'card' | 'sbp'

export type OrderStatus = 'accepted' | 'cooking' | 'on_the_way' | 'delivered' | 'cancelled'

// Прогресс-шаги доставки в порядке прохождения. 'cancelled' — терминальный, вне шкалы (step 0).
export const ORDER_STEPS = ['accepted', 'cooking', 'on_the_way', 'delivered'] as const

export const STATUS_META: Record<OrderStatus, { label: string; badgeClass: string; step: number }> = {
  accepted:   { label: 'Принят',           badgeClass: 'text-blue-600 bg-blue-50 border-blue-200',     step: 1 },
  cooking:    { label: 'Готовится',        badgeClass: 'text-orange-600 bg-orange-50 border-orange-200', step: 2 },
  on_the_way: { label: 'Передан курьеру',  badgeClass: 'text-purple-600 bg-purple-50 border-purple-200', step: 3 },
  delivered:  { label: 'Доставлен',        badgeClass: 'text-emerald-600 bg-emerald-50 border-emerald-200', step: 4 },
  cancelled:  { label: 'Отменён',          badgeClass: 'text-red-600 bg-red-50 border-red-200',          step: 0 },
}

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  cash: 'Наличными курьеру',
  card: 'Банковская карта',
  sbp:  'СБП',
}

// снимок позиции из корзины на момент оформления
export interface OrderItem {
  menuItemId: string
  productId: string
  productName: string
  variantName: string
  price: number
  quantity: number
  image: string | null
}

// тело запроса на создание заказа
export interface PlaceOrderPayload {
  items: OrderItem[]
  address: string
  comment: string
  paymentMethod: PaymentMethod
  promoCode: string | null
  bonusUsed: number
  tip: number
  subtotal: number
  deliveryCost: number
  promoDiscount: number
  total: number
  etaMinutes: number
}

// оценка заказа клиентом (§1.8)
export interface OrderRating {
  stars: number // 1..5
  comment: string
}

// созданный заказ
export interface PlacedOrder {
  id: string
  number: string
  status: OrderStatus
  total: number
  etaMinutes: number
  createdAt: string
  payload: PlaceOrderPayload
  rating: OrderRating | null
}
