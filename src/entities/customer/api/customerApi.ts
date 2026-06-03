import type { IAdminCustomer, IBonusAdjustment } from '../model/types'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const d = (daysAgo: number) => new Date(Date.now() - daysAgo * 86_400_000).toISOString()

const MOCK_CUSTOMERS: IAdminCustomer[] = [
  {
    id: 'cust-1', name: 'Мария Козлова', phone: '+7 (916) 234-56-78', email: 'kozlova.m@mail.ru',
    ordersCount: 3, totalSpent: 4210, bonusBalance: 210, registeredAt: d(120),
    bonusHistory: [
      { id: 'bh-1-1', type: 'earn',  amount: 67,  comment: 'Начислено за заказ', orderNumber: 'B-4821', createdAt: d(3) },
      { id: 'bh-1-2', type: 'earn',  amount: 105, comment: 'Начислено за заказ', orderNumber: 'B-3910', createdAt: d(20) },
      { id: 'bh-1-3', type: 'earn',  amount: 38,  comment: 'Начислено за заказ', orderNumber: 'B-2840', createdAt: d(60) },
    ],
  },
  {
    id: 'cust-2', name: 'Иван Соколов', phone: '+7 (925) 345-67-89', email: 'i.sokolov@yandex.ru',
    ordersCount: 7, totalSpent: 14850, bonusBalance: 742, registeredAt: d(200),
    bonusHistory: [
      { id: 'bh-2-1', type: 'earn',   amount: 105, comment: 'Начислено за заказ', orderNumber: 'B-4820', createdAt: d(8) },
      { id: 'bh-2-2', type: 'spend',  amount: 200, comment: 'Списано при оплате', orderNumber: 'B-4101', createdAt: d(30) },
      { id: 'bh-2-3', type: 'earn',   amount: 300, comment: 'Начислено за заказ', orderNumber: 'B-3200', createdAt: d(55) },
      { id: 'bh-2-4', type: 'manual_add', amount: 537, comment: 'Приветственный бонус', createdAt: d(200) },
    ],
  },
  {
    id: 'cust-3', name: 'Ольга Новикова', phone: '+7 (903) 456-78-90', email: 'novikova.o@gmail.com',
    ordersCount: 2, totalSpent: 1860, bonusBalance: 93, registeredAt: d(45),
    bonusHistory: [
      { id: 'bh-3-1', type: 'earn', amount: 48,  comment: 'Начислено за заказ', orderNumber: 'B-4819', createdAt: d(25) },
      { id: 'bh-3-2', type: 'earn', amount: 45,  comment: 'Начислено за заказ', orderNumber: 'B-4600', createdAt: d(40) },
    ],
  },
  {
    id: 'cust-4', name: 'Андрей Лебедев', phone: '+7 (926) 567-89-01', email: 'lebedev.a@corp.ru',
    ordersCount: 12, totalSpent: 31200, bonusBalance: 1560, registeredAt: d(365),
    bonusHistory: [
      { id: 'bh-4-1', type: 'earn',   amount: 172,  comment: 'Начислено за заказ', orderNumber: 'B-4818', createdAt: d(60) },
      { id: 'bh-4-2', type: 'spend',  amount: 500,  comment: 'Списано при оплате', orderNumber: 'B-4200', createdAt: d(90) },
      { id: 'bh-4-3', type: 'earn',   amount: 450,  comment: 'Начислено за заказ', orderNumber: 'B-3800', createdAt: d(120) },
      { id: 'bh-4-4', type: 'earn',   amount: 1438, comment: 'Начислено за заказ', orderNumber: 'B-prev', createdAt: d(300) },
    ],
  },
  {
    id: 'cust-5', name: 'Екатерина Морозова', phone: '+7 (909) 678-90-12', email: 'morozova.e@inbox.ru',
    ordersCount: 1, totalSpent: 870, bonusBalance: 0, registeredAt: d(15),
    bonusHistory: [
      { id: 'bh-5-1', type: 'earn',  amount: 43, comment: 'Начислено за заказ', orderNumber: 'B-4817', createdAt: d(90) },
      { id: 'bh-5-2', type: 'spend', amount: 43, comment: 'Списано при оплате', orderNumber: 'B-cancel', createdAt: d(2) },
    ],
  },
  {
    id: 'cust-6', name: 'Павел Волков', phone: '+7 (915) 789-01-23', email: 'p.volkov@bk.ru',
    ordersCount: 4, totalSpent: 6820, bonusBalance: 341, registeredAt: d(180),
    bonusHistory: [
      { id: 'bh-6-1', type: 'earn', amount: 84,  comment: 'Начислено за заказ', orderNumber: 'B-4816', createdAt: d(120) },
      { id: 'bh-6-2', type: 'earn', amount: 257, comment: 'Начислено за заказ', orderNumber: 'B-prev', createdAt: d(170) },
    ],
  },
  {
    id: 'cust-7', name: 'Наталья Смирнова', phone: '+7 (977) 890-12-34', email: 'smirnova.n@mail.ru',
    ordersCount: 5, totalSpent: 9600, bonusBalance: 480, registeredAt: d(90),
    bonusHistory: [
      { id: 'bh-7-1', type: 'earn',       amount: 96,  comment: 'Начислено за заказ', orderNumber: 'B-4815', createdAt: d(12) },
      { id: 'bh-7-2', type: 'earn',       amount: 384, comment: 'Начислено за заказ', orderNumber: 'B-prev', createdAt: d(80) },
    ],
  },
  {
    id: 'cust-8', name: 'Михаил Зайцев', phone: '+7 (967) 901-23-45', email: 'zaitsev.m@yandex.ru',
    ordersCount: 1, totalSpent: 550, bonusBalance: 27, registeredAt: d(7),
    bonusHistory: [
      { id: 'bh-8-1', type: 'earn', amount: 27, comment: 'Начислено за заказ', orderNumber: 'B-4814', createdAt: d(2) },
    ],
  },
  {
    id: 'cust-9', name: 'Светлана Кузнецова', phone: '+7 (911) 012-34-56', email: 'kuznetsova.s@gmail.com',
    ordersCount: 8, totalSpent: 19400, bonusBalance: 970, registeredAt: d(280),
    bonusHistory: [
      { id: 'bh-9-1', type: 'earn',       amount: 210, comment: 'Начислено за заказ', orderNumber: 'B-4813', createdAt: d(35) },
      { id: 'bh-9-2', type: 'spend',      amount: 400, comment: 'Списано при оплате', orderNumber: 'B-4500', createdAt: d(70) },
      { id: 'bh-9-3', type: 'manual_add', amount: 1160,comment: 'Компенсация за задержку', createdAt: d(150) },
    ],
  },
  {
    id: 'cust-10', name: 'Владимир Попов', phone: '+7 (985) 123-45-67', email: 'popov.v@inbox.ru',
    ordersCount: 3, totalSpent: 3300, bonusBalance: 165, registeredAt: d(60),
    bonusHistory: [
      { id: 'bh-10-1', type: 'earn', amount: 55,  comment: 'Начислено за заказ', orderNumber: 'B-4812', createdAt: d(60) },
      { id: 'bh-10-2', type: 'earn', amount: 110, comment: 'Начислено за заказ', orderNumber: 'B-prev', createdAt: d(55) },
    ],
  },
]

// MOCK: заменить на http.get<IAdminCustomer[]>('/admin/customers')
export async function fetchCustomers(): Promise<IAdminCustomer[]> {
  await delay(500)
  return MOCK_CUSTOMERS.map((c) => ({ ...c, bonusHistory: [...c.bonusHistory] }))
}

// MOCK: заменить на http.get<IAdminCustomer>(`/admin/customers/${id}`)
export async function fetchCustomer(id: string): Promise<IAdminCustomer> {
  await delay(300)
  const c = MOCK_CUSTOMERS.find((x) => x.id === id)
  if (!c) return Promise.reject({ message: 'Клиент не найден' })
  return { ...c, bonusHistory: [...c.bonusHistory] }
}

// MOCK: заменить на http.post(`/admin/customers/${id}/bonus-adjust`, payload)
export async function adjustCustomerBonus(id: string, payload: IBonusAdjustment): Promise<IAdminCustomer> {
  await delay(500)
  const c = MOCK_CUSTOMERS.find((x) => x.id === id)
  if (!c) return Promise.reject({ message: 'Клиент не найден' })

  const delta = payload.type === 'add' ? payload.amount : -payload.amount
  c.bonusBalance = Math.max(0, c.bonusBalance + delta)
  c.bonusHistory.unshift({
    id: crypto.randomUUID(),
    type: payload.type === 'add' ? 'manual_add' : 'manual_deduct',
    amount: payload.amount,
    comment: payload.comment,
    createdAt: new Date().toISOString(),
  })
  return { ...c, bonusHistory: [...c.bonusHistory] }
}
