import type { IRestaurantSettings } from '../model/types'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const MOCK_SETTINGS: IRestaurantSettings = {
  name: 'FoodHub',
  phone: '+7 (495) 123-45-67',
  address: 'ул. Арбат, д. 1, Москва',
  socialLinks: {
    instagram: 'foodhub.moscow',
    vk: 'foodhub',
    telegram: 'foodhub_bot',
  },
  minOrderAmount: 600,
  defaultEtaMinutes: 45,
  workingHours: {
    mon: { isOpen: true,  from: '10:00', to: '23:00' },
    tue: { isOpen: true,  from: '10:00', to: '23:00' },
    wed: { isOpen: true,  from: '10:00', to: '23:00' },
    thu: { isOpen: true,  from: '10:00', to: '23:00' },
    fri: { isOpen: true,  from: '10:00', to: '00:00' },
    sat: { isOpen: true,  from: '11:00', to: '00:00' },
    sun: { isOpen: true,  from: '11:00', to: '22:00' },
  },
}

// MOCK: заменить на http.get<IRestaurantSettings>('/admin/settings')
export async function fetchSettings(): Promise<IRestaurantSettings> {
  await delay(400)
  return JSON.parse(JSON.stringify(MOCK_SETTINGS))
}

// MOCK: заменить на http.put<IRestaurantSettings>('/admin/settings', payload)
export async function updateSettings(payload: IRestaurantSettings): Promise<IRestaurantSettings> {
  await delay(500)
  Object.assign(MOCK_SETTINGS, JSON.parse(JSON.stringify(payload)))
  return JSON.parse(JSON.stringify(MOCK_SETTINGS))
}
