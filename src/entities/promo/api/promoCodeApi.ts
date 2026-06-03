import type { IPromoCode, IPromoCodeDraft } from '../model/types'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const d = (daysAgo: number) => new Date(Date.now() - daysAgo * 86_400_000).toISOString()
const future = (daysAhead: number) => new Date(Date.now() + daysAhead * 86_400_000).toISOString()

const MOCK_PROMOS: IPromoCode[] = [
  {
    id: 'promo-1', code: 'WELCOME', type: 'percent', value: 10,
    expiresAt: null, usageLimit: null, usageCount: 47, totalDiscount: 8430,
    isActive: true, createdAt: d(120),
  },
  {
    id: 'promo-2', code: 'FIX200', type: 'fixed', value: 200,
    expiresAt: future(30), usageLimit: 100, usageCount: 23, totalDiscount: 4600,
    isActive: true, createdAt: d(60),
  },
  {
    id: 'promo-3', code: 'SUMMER25', type: 'percent', value: 25,
    expiresAt: future(14), usageLimit: 50, usageCount: 12, totalDiscount: 5760,
    isActive: true, createdAt: d(10),
  },
  {
    id: 'promo-4', code: 'FIRST500', type: 'fixed', value: 500,
    expiresAt: future(7), usageLimit: 30, usageCount: 30, totalDiscount: 15000,
    isActive: false, createdAt: d(45),
  },
  {
    id: 'promo-5', code: 'VIP15', type: 'percent', value: 15,
    expiresAt: null, usageLimit: null, usageCount: 8, totalDiscount: 3200,
    isActive: true, createdAt: d(20),
  },
  {
    id: 'promo-6', code: 'BLACKFRI', type: 'percent', value: 30,
    expiresAt: d(-5), usageLimit: 200, usageCount: 156, totalDiscount: 78000,
    isActive: false, createdAt: d(30),
  },
  {
    id: 'promo-7', code: 'NEW100', type: 'fixed', value: 100,
    expiresAt: future(60), usageLimit: null, usageCount: 3, totalDiscount: 300,
    isActive: true, createdAt: d(3),
  },
  {
    id: 'promo-8', code: 'LOYAL20', type: 'percent', value: 20,
    expiresAt: null, usageLimit: null, usageCount: 0, totalDiscount: 0,
    isActive: false, createdAt: d(1),
  },
]

// MOCK: заменить на http.get<IPromoCode[]>('/admin/promo-codes')
export async function fetchPromoCodes(): Promise<IPromoCode[]> {
  await delay(400)
  return MOCK_PROMOS.map((p) => ({ ...p }))
}

// MOCK: заменить на http.post<IPromoCode>('/admin/promo-codes', payload)
export async function createPromoCode(draft: IPromoCodeDraft): Promise<IPromoCode> {
  await delay(500)
  const existing = MOCK_PROMOS.find((p) => p.code === draft.code.trim().toUpperCase())
  if (existing) return Promise.reject({ message: 'Такой промокод уже существует' })

  const promo: IPromoCode = {
    id: crypto.randomUUID(),
    code: draft.code.trim().toUpperCase(),
    type: draft.type,
    value: Number(draft.value),
    expiresAt: draft.expiresAt || null,
    usageLimit: draft.usageLimit ? Number(draft.usageLimit) : null,
    usageCount: 0,
    totalDiscount: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
  }
  MOCK_PROMOS.unshift(promo)
  return { ...promo }
}

// MOCK: заменить на http.patch(`/admin/promo-codes/${id}/toggle`)
export async function togglePromoCode(id: string): Promise<IPromoCode> {
  await delay(300)
  const promo = MOCK_PROMOS.find((p) => p.id === id)
  if (!promo) return Promise.reject({ message: 'Промокод не найден' })
  promo.isActive = !promo.isActive
  return { ...promo }
}
