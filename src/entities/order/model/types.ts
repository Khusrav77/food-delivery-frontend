export type PaymentMethod = 'cash' | 'card' | 'sbp'

export type OrderStatus = 'accepted' | 'cooking' | 'on_the_way' | 'delivered'

// один товар в составе заказа (снимок из корзины на момент оформления)
export interface OrderItem {
  productName: string
  variantName: string
  price: number
  quantity: number
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

// созданный заказ, который вернул бэкенд
export interface PlacedOrder {
  id: string
  number: string
  status: OrderStatus
  total: number
  etaMinutes: number
  createdAt: string
  payload: PlaceOrderPayload
}
