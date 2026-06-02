import type { IAddress, AddressLabel } from '../model/types'

let db: IAddress[] = [
  {
    id: 'addr-1',
    label: 'home',
    street: 'ул. Тверская',
    house: '12',
    apartment: '45',
    entrance: '2',
    floor: '5',
    comment: 'Код домофона 45',
    isPrimary: true,
  },
  {
    id: 'addr-2',
    label: 'work',
    street: 'Пресненская наб.',
    house: '8',
    apartment: '1203',
    entrance: '1',
    floor: '12',
    comment: '',
    isPrimary: false,
  },
]

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

// MOCK: заменить на http.get/post/put/delete('/me/addresses')
export async function fetchAddresses(): Promise<IAddress[]> {
  await delay(300)
  return db.map((a) => ({ ...a }))
}

export interface CreateAddressPayload {
  label: AddressLabel
  street: string
  house: string
  apartment: string
  entrance: string
  floor: string
  comment: string
}

export async function createAddress(payload: CreateAddressPayload): Promise<IAddress> {
  await delay(500)
  const addr: IAddress = {
    id: `addr-${Date.now()}`,
    ...payload,
    isPrimary: db.length === 0,
  }
  db.push(addr)
  return { ...addr }
}

export async function updateAddress(id: string, payload: CreateAddressPayload): Promise<IAddress> {
  await delay(500)
  const idx = db.findIndex((a) => a.id === id)
  if (idx === -1) return Promise.reject({ message: 'Адрес не найден' })
  db[idx] = { ...db[idx], ...payload }
  return { ...db[idx] }
}

export async function removeAddress(id: string): Promise<void> {
  await delay(400)
  const wasPrimary = db.find((a) => a.id === id)?.isPrimary ?? false
  db = db.filter((a) => a.id !== id)
  if (wasPrimary && db.length > 0) db[0].isPrimary = true
}

export async function setPrimaryAddress(id: string): Promise<void> {
  await delay(300)
  db = db.map((a) => ({ ...a, isPrimary: a.id === id }))
}
