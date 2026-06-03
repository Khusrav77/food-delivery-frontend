import type { ICard } from '../model/types'

let db: ICard[] = [
  {
    id: 'card-1',
    brand: 'visa',
    last4: '4242',
    expMonth: '09',
    expYear: '28',
    holder: 'IVAN IVANOV',
    isPrimary: true,
  },
  {
    id: 'card-2',
    brand: 'mir',
    last4: '8810',
    expMonth: '12',
    expYear: '26',
    holder: 'IVAN IVANOV',
    isPrimary: false,
  },
]

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export interface CreateCardPayload {
  number: string
  expMonth: string
  expYear: string
  holder: string
}

// MOCK: GET /me/cards
export async function fetchCards(): Promise<ICard[]> {
  await delay(300)
  return db.map((c) => ({ ...c }))
}

// MOCK: POST /me/cards
export async function createCard(payload: CreateCardPayload): Promise<ICard> {
  await delay(500)
  const { detectBrand } = await import('../lib/cardBrand')
  const card: ICard = {
    id: `card-${Date.now()}`,
    brand: detectBrand(payload.number),
    last4: payload.number.replace(/\s/g, '').slice(-4),
    expMonth: payload.expMonth,
    expYear: payload.expYear,
    holder: payload.holder.trim().toUpperCase(),
    isPrimary: db.length === 0,
  }
  db.push(card)
  return { ...card }
}

// MOCK: DELETE /me/cards/:id
export async function removeCard(id: string): Promise<void> {
  await delay(400)
  const wasPrimary = db.find((c) => c.id === id)?.isPrimary ?? false
  db = db.filter((c) => c.id !== id)
  if (wasPrimary && db.length > 0) db[0].isPrimary = true
}

// MOCK: PATCH /me/cards/:id/primary
export async function setPrimaryCard(id: string): Promise<void> {
  await delay(300)
  db = db.map((c) => ({ ...c, isPrimary: c.id === id }))
}
