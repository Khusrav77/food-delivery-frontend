import type { INotification } from '../model/types'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

// MOCK: in-memory db — заменить на http.get<INotification[]>('/me/notifications')
const db: INotification[] = [
  {
    id: 'n-1',
    type: 'order',
    title: 'Заказ доставлен',
    body: 'Ваш заказ №A-7391 успешно доставлен. Приятного аппетита!',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isRead: false,
    orderId: 'A-7391',
  },
  {
    id: 'n-2',
    type: 'bonus',
    title: 'Начислены бонусы',
    body: 'За заказ №A-7391 вам начислено 93 бонуса. Используйте их при следующей оплате.',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    id: 'n-3',
    type: 'order',
    title: 'Заказ передан курьеру',
    body: 'Курьер уже в пути с вашим заказом №A-5628. Ожидаемое время — 15 минут.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    orderId: 'A-5628',
  },
  {
    id: 'n-4',
    type: 'promo',
    title: '−20% на первый заказ недели',
    body: 'Только до воскресенья: скидка 20% по промокоду WEEK20 на любой заказ от 800 ₽.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: 'n-5',
    type: 'bonus',
    title: 'Приветственные бонусы',
    body: 'Добро пожаловать! Мы начислили вам 50 приветственных бонусов.',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: 'n-6',
    type: 'promo',
    title: 'Бесплатная доставка',
    body: 'Сегодня доставка бесплатна при заказе от 500 ₽. Не упустите момент!',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
]

export async function fetchNotifications(): Promise<INotification[]> {
  await delay(300)
  return db.map((n) => ({ ...n }))
}

export async function markAllRead(): Promise<void> {
  await delay(300)
  db.forEach((n) => {
    n.isRead = true
  })
}
