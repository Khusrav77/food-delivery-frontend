import type { IBonusTransaction } from '../model/types'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const MOCK_TRANSACTIONS: IBonusTransaction[] = [
  {
    id: 'bt-1',
    type: 'earn',
    amount: 93,
    description: 'Начислено за заказ',
    orderNumber: 'A-7391',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'bt-2',
    type: 'earn',
    amount: 117,
    description: 'Начислено за заказ',
    orderNumber: 'A-5628',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'bt-3',
    type: 'spend',
    amount: 50,
    description: 'Списано при оплате заказа',
    orderNumber: 'A-2847',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    id: 'bt-4',
    type: 'earn',
    amount: 50,
    description: 'Приветственные бонусы',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// MOCK: заменить на http.get<IBonusTransaction[]>('/me/bonuses')
export async function fetchBonusHistory(): Promise<IBonusTransaction[]> {
  await delay(400)
  return [...MOCK_TRANSACTIONS]
}
