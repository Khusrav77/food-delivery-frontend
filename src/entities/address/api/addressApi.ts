import type { IAddress } from '../model/types'

const MOCK_ADDRESSES: IAddress[] = [
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

// MOCK: эндпоинта адресов пользователя ещё нет.
// Заменить на: const res = await http.get<IAddress[]>('/me/addresses'); return res.data
export async function fetchAddresses(): Promise<IAddress[]> {
  await new Promise((r) => setTimeout(r, 300))
  return MOCK_ADDRESSES.map((a) => ({ ...a }))
}
