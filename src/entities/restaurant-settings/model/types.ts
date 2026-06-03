export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export const DAY_LABELS: Record<DayOfWeek, string> = {
  mon: 'Понедельник', tue: 'Вторник',  wed: 'Среда',
  thu: 'Четверг',     fri: 'Пятница',  sat: 'Суббота', sun: 'Воскресенье',
}

export const DAYS: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export interface IWorkingHours {
  isOpen: boolean
  from: string // 'HH:MM'
  to: string
}

export interface IRestaurantSettings {
  name: string
  phone: string
  address: string
  socialLinks: { instagram: string; vk: string; telegram: string }
  minOrderAmount: number
  defaultEtaMinutes: number
  workingHours: Record<DayOfWeek, IWorkingHours>
}
