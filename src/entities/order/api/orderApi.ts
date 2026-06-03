import type { OrderRating, OrderStatus, PlaceOrderPayload, PlacedOrder } from '../model/types'
import { ORDER_STEPS } from '../model/types'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const MOCK_ORDERS: PlacedOrder[] = [
  {
    id: 'ord-1',
    number: 'A-7391',
    status: 'delivered',
    total: 1850,
    etaMinutes: 45,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    rating: { stars: 5, comment: 'Всё отлично, спасибо!' },
    payload: {
      items: [
        { menuItemId: 'm1', productId: 'p1', productName: 'Маргарита', variantName: '30 см', price: 750, quantity: 1, image: null },
        { menuItemId: 'm2', productId: 'p2', productName: 'Цезарь', variantName: 'Стандарт', price: 450, quantity: 2, image: null },
      ],
      address: 'ул. Тверская, д. 12, кв. 45, подъезд 2, этаж 5',
      comment: 'Код домофона 45',
      paymentMethod: 'cash',
      promoCode: null,
      bonusUsed: 0,
      tip: 0,
      subtotal: 1650,
      deliveryCost: 200,
      promoDiscount: 0,
      total: 1850,
      etaMinutes: 45,
    },
  },
  {
    id: 'ord-2',
    number: 'A-5628',
    status: 'delivered',
    total: 2340,
    etaMinutes: 60,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    rating: null,
    payload: {
      items: [
        { menuItemId: 'm3', productId: 'p3', productName: 'Борщ', variantName: 'Большая порция', price: 380, quantity: 2, image: null },
        { menuItemId: 'm4', productId: 'p4', productName: 'Стейк из говядины', variantName: '300 г', price: 1200, quantity: 1, image: null },
        { menuItemId: 'm5', productId: 'p5', productName: 'Лимонад', variantName: '500 мл', price: 180, quantity: 2, image: null },
      ],
      address: 'Пресненская наб., д. 8, кв. 1203, подъезд 1, этаж 12',
      comment: '',
      paymentMethod: 'card',
      promoCode: 'WELCOME',
      bonusUsed: 0,
      tip: 0,
      subtotal: 2520,
      deliveryCost: 0,
      promoDiscount: 180,
      total: 2340,
      etaMinutes: 60,
    },
  },
  {
    id: 'ord-3',
    number: 'A-2847',
    status: 'on_the_way',
    total: 960,
    etaMinutes: 30,
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    rating: null,
    payload: {
      items: [
        { menuItemId: 'm6', productId: 'p6', productName: 'Пепперони', variantName: '40 см', price: 890, quantity: 1, image: null },
        { menuItemId: 'm7', productId: 'p7', productName: 'Кола', variantName: '0.5 л', price: 120, quantity: 1, image: null },
      ],
      address: 'ул. Тверская, д. 12, кв. 45',
      comment: '',
      paymentMethod: 'sbp',
      promoCode: null,
      bonusUsed: 50,
      tip: 0,
      subtotal: 1010,
      deliveryCost: 0,
      promoDiscount: 0,
      total: 960,
      etaMinutes: 30,
    },
  },
  {
    id: 'ord-4',
    number: 'A-1593',
    status: 'cooking',
    total: 1450,
    etaMinutes: 45,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    rating: null,
    payload: {
      items: [
        { menuItemId: 'm8', productId: 'p8', productName: 'Карбонара', variantName: 'Стандарт', price: 620, quantity: 1, image: null },
        { menuItemId: 'm9', productId: 'p9', productName: 'Тирамису', variantName: 'Порция', price: 320, quantity: 1, image: null },
        { menuItemId: 'm7', productId: 'p7', productName: 'Кола', variantName: '0.5 л', price: 120, quantity: 1, image: null },
      ],
      address: 'ул. Тверская, д. 12, кв. 45',
      comment: 'Пожалуйста, без лука в карбонаре',
      paymentMethod: 'card',
      promoCode: null,
      bonusUsed: 0,
      tip: 65,
      subtotal: 1060,
      deliveryCost: 0,
      promoDiscount: 0,
      total: 1450,
      etaMinutes: 45,
    },
  },
]

// MOCK: заменить на http.post<PlacedOrder>('/orders', payload)
export async function createOrder(payload: PlaceOrderPayload): Promise<PlacedOrder> {
  await delay(700)
  const num = Math.floor(1000 + Math.random() * 9000)
  const order: PlacedOrder = {
    id: crypto.randomUUID(),
    number: `A-${num}`,
    status: 'accepted',
    total: payload.total,
    etaMinutes: payload.etaMinutes,
    createdAt: new Date().toISOString(),
    payload,
    rating: null,
  }
  MOCK_ORDERS.unshift(order)
  return order
}

// MOCK: заменить на http.get<PlacedOrder[]>('/me/orders')
export async function fetchOrders(): Promise<PlacedOrder[]> {
  await delay(500)
  return MOCK_ORDERS.map((o) => ({ ...o }))
}

// MOCK: заменить на http.get<PlacedOrder>(`/me/orders/${id}`)
export async function fetchOrder(id: string): Promise<PlacedOrder> {
  await delay(300)
  const order = MOCK_ORDERS.find((o) => o.id === id)
  if (!order) return Promise.reject({ message: 'Заказ не найден' })
  return { ...order }
}

// MOCK: заменить на http.post(`/me/orders/${id}/cancel`)
export async function cancelOrder(id: string): Promise<PlacedOrder> {
  await delay(400)
  const order = MOCK_ORDERS.find((o) => o.id === id)
  if (!order) return Promise.reject({ message: 'Заказ не найден' })
  order.status = 'cancelled'
  return { ...order }
}

// MOCK: заменить на http.post(`/me/orders/${id}/rating`, payload)
export async function submitRating(id: string, payload: OrderRating): Promise<PlacedOrder> {
  await delay(500)
  const order = MOCK_ORDERS.find((o) => o.id === id)
  if (!order) return Promise.reject({ message: 'Заказ не найден' })
  order.rating = { ...payload }
  return { ...order }
}

// MOCK-only: имитация продвижения статуса доставки на стороне «бэкенда».
// На реальном API статус двигает бэкенд — клиент его опрашивает (polling/WS), а не толкает.
export async function advanceOrderStatus(id: string): Promise<PlacedOrder> {
  await delay(200)
  const order = MOCK_ORDERS.find((o) => o.id === id)
  if (!order) return Promise.reject({ message: 'Заказ не найден' })
  const idx = (ORDER_STEPS as readonly OrderStatus[]).indexOf(order.status)
  if (idx >= 0 && idx < ORDER_STEPS.length - 1) {
    order.status = ORDER_STEPS[idx + 1]
  }
  return { ...order }
}
