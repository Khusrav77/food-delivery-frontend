import type { AdminOrder, OrderStatus } from '../model/types'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const MOCK_COURIERS = [
  { id: 'c-1', name: 'Дмитрий Орлов' },
  { id: 'c-2', name: 'Алексей Ковалёв' },
  { id: 'c-3', name: 'Илья Петров' },
  { id: 'c-4', name: 'Максим Фёдоров' },
  { id: 'c-5', name: 'Евгений Сидоров' },
]

const now = Date.now()
const min = (n: number) => n * 60 * 1000
const hr  = (n: number) => n * 60 * min(1)

const MOCK_ADMIN_ORDERS: AdminOrder[] = [
  {
    id: 'ao-1', number: 'B-4821', status: 'accepted',
    total: 1350, etaMinutes: 45, createdAt: new Date(now - min(3)).toISOString(),
    clientName: 'Мария Козлова', clientPhone: '+7 (916) 234-56-78',
    courierId: null, courierName: null, deliveryZone: 'free', rating: null,
    payload: { items: [{ menuItemId: 'm1', productId: 'p1', productName: 'Маргарита', variantName: '30 см', price: 750, quantity: 1, image: null }, { menuItemId: 'm7', productId: 'p7', productName: 'Кола', variantName: '0.5 л', price: 120, quantity: 2, image: null }], address: 'ул. Арбат, д. 18, кв. 12', comment: 'Домофон 12#34', paymentMethod: 'card', promoCode: null, bonusUsed: 0, tip: 0, subtotal: 990, deliveryCost: 0, promoDiscount: 0, total: 1350, etaMinutes: 45 },
  },
  {
    id: 'ao-2', number: 'B-4820', status: 'cooking',
    total: 2100, etaMinutes: 40, createdAt: new Date(now - min(8)).toISOString(),
    clientName: 'Иван Соколов', clientPhone: '+7 (925) 345-67-89',
    courierId: 'c-2', courierName: 'Алексей Ковалёв', deliveryZone: 'paid', rating: null,
    payload: { items: [{ menuItemId: 'm8', productId: 'p8', productName: 'Карбонара', variantName: 'Большая', price: 780, quantity: 2, image: null }, { menuItemId: 'm9', productId: 'p9', productName: 'Тирамису', variantName: 'Порция', price: 320, quantity: 1, image: null }], address: 'Пресненская наб., д. 6, кв. 401', comment: '', paymentMethod: 'cash', promoCode: null, bonusUsed: 0, tip: 120, subtotal: 1880, deliveryCost: 199, promoDiscount: 0, total: 2100, etaMinutes: 40 },
  },
  {
    id: 'ao-3', number: 'B-4819', status: 'on_the_way',
    total: 960, etaMinutes: 15, createdAt: new Date(now - min(25)).toISOString(),
    clientName: 'Ольга Новикова', clientPhone: '+7 (903) 456-78-90',
    courierId: 'c-1', courierName: 'Дмитрий Орлов', deliveryZone: 'free', rating: null,
    payload: { items: [{ menuItemId: 'm6', productId: 'p6', productName: 'Пепперони', variantName: '40 см', price: 890, quantity: 1, image: null }, { menuItemId: 'm7', productId: 'p7', productName: 'Кола', variantName: '0.5 л', price: 120, quantity: 1, image: null }], address: 'ул. Тверская, д. 22, кв. 89', comment: '', paymentMethod: 'sbp', promoCode: null, bonusUsed: 50, tip: 0, subtotal: 1010, deliveryCost: 0, promoDiscount: 0, total: 960, etaMinutes: 15 },
  },
  {
    id: 'ao-4', number: 'B-4818', status: 'delivered',
    total: 3450, etaMinutes: 45, createdAt: new Date(now - hr(1)).toISOString(),
    clientName: 'Андрей Лебедев', clientPhone: '+7 (926) 567-89-01',
    courierId: 'c-3', courierName: 'Илья Петров', deliveryZone: 'paid', rating: { stars: 5, comment: 'Отличная доставка!' },
    payload: { items: [{ menuItemId: 'm3', productId: 'p3', productName: 'Борщ', variantName: 'Большая', price: 380, quantity: 2, image: null }, { menuItemId: 'm4', productId: 'p4', productName: 'Стейк', variantName: '300 г', price: 1200, quantity: 2, image: null }], address: 'Кутузовский пр., д. 30, кв. 55', comment: 'Позвонить за 5 мин', paymentMethod: 'card', promoCode: 'WELCOME', bonusUsed: 0, tip: 300, subtotal: 3160, deliveryCost: 199, promoDiscount: 210, total: 3450, etaMinutes: 45 },
  },
  {
    id: 'ao-5', number: 'B-4817', status: 'cancelled',
    total: 870, etaMinutes: 40, createdAt: new Date(now - hr(1.5)).toISOString(),
    clientName: 'Екатерина Морозова', clientPhone: '+7 (909) 678-90-12',
    courierId: null, courierName: null, deliveryZone: 'free', rating: null,
    payload: { items: [{ menuItemId: 'm5', productId: 'p5', productName: 'Лимонад', variantName: '500 мл', price: 180, quantity: 3, image: null }, { menuItemId: 'm2', productId: 'p2', productName: 'Цезарь', variantName: 'Стандарт', price: 450, quantity: 1, image: null }], address: 'ул. Садовая, д. 10, кв. 7', comment: '', paymentMethod: 'card', promoCode: null, bonusUsed: 0, tip: 0, subtotal: 990, deliveryCost: 0, promoDiscount: 0, total: 870, etaMinutes: 40 },
  },
  {
    id: 'ao-6', number: 'B-4816', status: 'delivered',
    total: 1680, etaMinutes: 50, createdAt: new Date(now - hr(2)).toISOString(),
    clientName: 'Павел Волков', clientPhone: '+7 (915) 789-01-23',
    courierId: 'c-4', courierName: 'Максим Фёдоров', deliveryZone: 'free', rating: { stars: 4, comment: '' },
    payload: { items: [{ menuItemId: 'm8', productId: 'p8', productName: 'Карбонара', variantName: 'Стандарт', price: 620, quantity: 2, image: null }, { menuItemId: 'm7', productId: 'p7', productName: 'Кола', variantName: '0.5 л', price: 120, quantity: 1, image: null }], address: 'Ленинградский пр., д. 41, кв. 200', comment: '', paymentMethod: 'card', promoCode: null, bonusUsed: 100, tip: 0, subtotal: 1360, deliveryCost: 0, promoDiscount: 0, total: 1680, etaMinutes: 50 },
  },
  {
    id: 'ao-7', number: 'B-4815', status: 'cooking',
    total: 1920, etaMinutes: 35, createdAt: new Date(now - min(12)).toISOString(),
    clientName: 'Наталья Смирнова', clientPhone: '+7 (977) 890-12-34',
    courierId: null, courierName: null, deliveryZone: 'paid', rating: null,
    payload: { items: [{ menuItemId: 'm1', productId: 'p1', productName: 'Маргарита', variantName: '40 см', price: 990, quantity: 1, image: null }, { menuItemId: 'm3', productId: 'p3', productName: 'Борщ', variantName: 'Стандарт', price: 280, quantity: 2, image: null }, { menuItemId: 'm7', productId: 'p7', productName: 'Кола', variantName: '0.5 л', price: 120, quantity: 1, image: null }], address: 'ул. Профсоюзная, д. 5, кв. 34', comment: 'Позвоните при въезде', paymentMethod: 'sbp', promoCode: null, bonusUsed: 0, tip: 70, subtotal: 1670, deliveryCost: 199, promoDiscount: 0, total: 1920, etaMinutes: 35 },
  },
  {
    id: 'ao-8', number: 'B-4814', status: 'accepted',
    total: 550, etaMinutes: 45, createdAt: new Date(now - min(2)).toISOString(),
    clientName: 'Михаил Зайцев', clientPhone: '+7 (967) 901-23-45',
    courierId: null, courierName: null, deliveryZone: 'free', rating: null,
    payload: { items: [{ menuItemId: 'm2', productId: 'p2', productName: 'Цезарь', variantName: 'Стандарт', price: 450, quantity: 1, image: null }, { menuItemId: 'm5', productId: 'p5', productName: 'Лимонад', variantName: '500 мл', price: 180, quantity: 1, image: null }], address: 'ул. Марксистская, д. 3, кв. 8', comment: '', paymentMethod: 'cash', promoCode: null, bonusUsed: 80, tip: 0, subtotal: 550, deliveryCost: 0, promoDiscount: 0, total: 550, etaMinutes: 45 },
  },
  {
    id: 'ao-9', number: 'B-4813', status: 'on_the_way',
    total: 4200, etaMinutes: 20, createdAt: new Date(now - min(35)).toISOString(),
    clientName: 'Светлана Кузнецова', clientPhone: '+7 (911) 012-34-56',
    courierId: 'c-5', courierName: 'Евгений Сидоров', deliveryZone: 'paid', rating: null,
    payload: { items: [{ menuItemId: 'm4', productId: 'p4', productName: 'Стейк', variantName: '400 г', price: 1600, quantity: 2, image: null }, { menuItemId: 'm9', productId: 'p9', productName: 'Тирамису', variantName: 'Порция', price: 320, quantity: 2, image: null }], address: 'Лесная ул., д. 2, кв. 110', comment: 'Код домофона 4578', paymentMethod: 'card', promoCode: 'FIX200', bonusUsed: 0, tip: 360, subtotal: 3840, deliveryCost: 199, promoDiscount: 200, total: 4200, etaMinutes: 20 },
  },
  {
    id: 'ao-10', number: 'B-4812', status: 'delivered',
    total: 1100, etaMinutes: 50, createdAt: new Date(now - hr(3)).toISOString(),
    clientName: 'Владимир Попов', clientPhone: '+7 (985) 123-45-67',
    courierId: 'c-2', courierName: 'Алексей Ковалёв', deliveryZone: 'free', rating: { stars: 3, comment: 'Долго ждал' },
    payload: { items: [{ menuItemId: 'm6', productId: 'p6', productName: 'Пепперони', variantName: '30 см', price: 690, quantity: 1, image: null }, { menuItemId: 'm7', productId: 'p7', productName: 'Кола', variantName: '0.5 л', price: 120, quantity: 2, image: null }, { menuItemId: 'm5', productId: 'p5', productName: 'Лимонад', variantName: '500 мл', price: 180, quantity: 1, image: null }], address: 'Щёлковское шоссе, д. 15, кв. 67', comment: '', paymentMethod: 'card', promoCode: null, bonusUsed: 0, tip: 0, subtotal: 1110, deliveryCost: 0, promoDiscount: 0, total: 1100, etaMinutes: 50 },
  },
]

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  await delay(500)
  return MOCK_ADMIN_ORDERS.map((o) => ({ ...o }))
}

export async function fetchAdminOrder(id: string): Promise<AdminOrder> {
  await delay(300)
  const order = MOCK_ADMIN_ORDERS.find((o) => o.id === id)
  if (!order) return Promise.reject({ message: 'Заказ не найден' })
  return { ...order }
}

// MOCK: заменить на http.patch(`/admin/orders/${id}/status`, { status })
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<AdminOrder> {
  await delay(400)
  const order = MOCK_ADMIN_ORDERS.find((o) => o.id === id)
  if (!order) return Promise.reject({ message: 'Заказ не найден' })
  order.status = status
  return { ...order }
}

// MOCK: заменить на http.patch(`/admin/orders/${id}/courier`, { courierId })
export async function assignCourier(id: string, courierId: string | null): Promise<AdminOrder> {
  await delay(400)
  const order = MOCK_ADMIN_ORDERS.find((o) => o.id === id)
  if (!order) return Promise.reject({ message: 'Заказ не найден' })
  const courier = MOCK_COURIERS.find((c) => c.id === courierId)
  order.courierId = courierId
  order.courierName = courier?.name ?? null
  return { ...order }
}
