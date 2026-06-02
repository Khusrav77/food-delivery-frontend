import type { IAdminCourier, ICourierDraft } from '../model/types'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))
const d = (daysAgo: number) => new Date(Date.now() - daysAgo * 86_400_000).toISOString()

const MOCK_COURIERS: IAdminCourier[] = [
  {
    id: 'c-1', name: 'Дмитрий Орлов', phone: '+7 (916) 100-11-22',
    isOnline: true, activeOrdersCount: 1, totalDeliveries: 247,
    earnings: { week: 8400, month: 32600 },
    joinedAt: d(180),
    deliveryHistory: [
      { id: 'd1-1', orderNumber: 'B-4819', clientName: 'Ольга Новикова',   address: 'ул. Тверская, д. 22, кв. 89', deliveredAt: d(0), earnings: 180 },
      { id: 'd1-2', orderNumber: 'B-4801', clientName: 'Иван Соколов',     address: 'Пресненская наб., д. 6',      deliveredAt: d(1), earnings: 150 },
      { id: 'd1-3', orderNumber: 'B-4790', clientName: 'Павел Волков',     address: 'Ленинградский пр., д. 41',    deliveredAt: d(1), earnings: 200 },
      { id: 'd1-4', orderNumber: 'B-4775', clientName: 'Мария Козлова',    address: 'ул. Арбат, д. 18',            deliveredAt: d(2), earnings: 180 },
      { id: 'd1-5', orderNumber: 'B-4760', clientName: 'Андрей Лебедев',   address: 'Кутузовский пр., д. 30',      deliveredAt: d(3), earnings: 220 },
    ],
  },
  {
    id: 'c-2', name: 'Алексей Ковалёв', phone: '+7 (925) 200-33-44',
    isOnline: true, activeOrdersCount: 2, totalDeliveries: 183,
    earnings: { week: 6200, month: 24800 },
    joinedAt: d(120),
    deliveryHistory: [
      { id: 'd2-1', orderNumber: 'B-4820', clientName: 'Иван Соколов',     address: 'Пресненская наб., д. 6, кв. 401', deliveredAt: d(0), earnings: 199 },
      { id: 'd2-2', orderNumber: 'B-4812', clientName: 'Владимир Попов',   address: 'Щёлковское шоссе, д. 15',         deliveredAt: d(2), earnings: 0 },
      { id: 'd2-3', orderNumber: 'B-4798', clientName: 'Наталья Смирнова', address: 'ул. Профсоюзная, д. 5',           deliveredAt: d(4), earnings: 199 },
      { id: 'd2-4', orderNumber: 'B-4781', clientName: 'Светлана Кузнецова', address: 'Лесная ул., д. 2',             deliveredAt: d(5), earnings: 199 },
    ],
  },
  {
    id: 'c-3', name: 'Илья Петров', phone: '+7 (903) 300-55-66',
    isOnline: false, activeOrdersCount: 0, totalDeliveries: 95,
    earnings: { week: 1800, month: 14200 },
    joinedAt: d(60),
    deliveryHistory: [
      { id: 'd3-1', orderNumber: 'B-4818', clientName: 'Андрей Лебедев',   address: 'Кутузовский пр., д. 30, кв. 55', deliveredAt: d(2), earnings: 199 },
      { id: 'd3-2', orderNumber: 'B-4803', clientName: 'Михаил Зайцев',   address: 'ул. Марксистская, д. 3',          deliveredAt: d(5), earnings: 0 },
      { id: 'd3-3', orderNumber: 'B-4789', clientName: 'Ольга Новикова',   address: 'ул. Тверская, д. 22',            deliveredAt: d(8), earnings: 180 },
    ],
  },
  {
    id: 'c-4', name: 'Максим Фёдоров', phone: '+7 (926) 400-77-88',
    isOnline: true, activeOrdersCount: 0, totalDeliveries: 312,
    earnings: { week: 9800, month: 38400 },
    joinedAt: d(300),
    deliveryHistory: [
      { id: 'd4-1', orderNumber: 'B-4816', clientName: 'Павел Волков',     address: 'Ленинградский пр., д. 41, кв. 200', deliveredAt: d(1), earnings: 0 },
      { id: 'd4-2', orderNumber: 'B-4805', clientName: 'Екатерина Морозова', address: 'ул. Садовая, д. 10',             deliveredAt: d(2), earnings: 0 },
      { id: 'd4-3', orderNumber: 'B-4792', clientName: 'Иван Соколов',     address: 'Пресненская наб., д. 6',           deliveredAt: d(3), earnings: 199 },
      { id: 'd4-4', orderNumber: 'B-4774', clientName: 'Мария Козлова',    address: 'ул. Арбат, д. 18',                 deliveredAt: d(5), earnings: 0 },
      { id: 'd4-5', orderNumber: 'B-4755', clientName: 'Андрей Лебедев',   address: 'Кутузовский пр., д. 30',           deliveredAt: d(7), earnings: 199 },
    ],
  },
  {
    id: 'c-5', name: 'Евгений Сидоров', phone: '+7 (977) 500-99-00',
    isOnline: true, activeOrdersCount: 1, totalDeliveries: 58,
    earnings: { week: 5100, month: 18700 },
    joinedAt: d(45),
    deliveryHistory: [
      { id: 'd5-1', orderNumber: 'B-4813', clientName: 'Светлана Кузнецова', address: 'Лесная ул., д. 2, кв. 110', deliveredAt: d(1), earnings: 199 },
      { id: 'd5-2', orderNumber: 'B-4795', clientName: 'Владимир Попов',   address: 'Щёлковское шоссе, д. 15',      deliveredAt: d(3), earnings: 0 },
    ],
  },
]

export async function fetchCouriers(): Promise<IAdminCourier[]> {
  await delay(400)
  return MOCK_COURIERS.map((c) => ({ ...c, deliveryHistory: [...c.deliveryHistory] }))
}

export async function fetchCourier(id: string): Promise<IAdminCourier> {
  await delay(300)
  const c = MOCK_COURIERS.find((x) => x.id === id)
  if (!c) return Promise.reject({ message: 'Курьер не найден' })
  return { ...c, deliveryHistory: [...c.deliveryHistory] }
}

// MOCK: заменить на http.post<IAdminCourier>('/admin/couriers', payload)
export async function createCourier(draft: ICourierDraft): Promise<IAdminCourier> {
  await delay(500)
  const courier: IAdminCourier = {
    id: `c-${Date.now()}`,
    name: draft.name.trim(),
    phone: draft.phone.trim(),
    isOnline: false,
    activeOrdersCount: 0,
    totalDeliveries: 0,
    earnings: { week: 0, month: 0 },
    joinedAt: new Date().toISOString(),
    deliveryHistory: [],
  }
  MOCK_COURIERS.push(courier)
  return { ...courier }
}

// MOCK: заменить на http.patch<IAdminCourier>(`/admin/couriers/${id}`, payload)
export async function updateCourier(id: string, draft: ICourierDraft): Promise<IAdminCourier> {
  await delay(400)
  const c = MOCK_COURIERS.find((x) => x.id === id)
  if (!c) return Promise.reject({ message: 'Курьер не найден' })
  c.name = draft.name.trim()
  c.phone = draft.phone.trim()
  return { ...c, deliveryHistory: [...c.deliveryHistory] }
}
