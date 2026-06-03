export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export const DAYS: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export const DAY_LABELS: Record<DayOfWeek, string> = {
  mon: 'Пн', tue: 'Вт', wed: 'Ср',
  thu: 'Чт', fri: 'Пт', sat: 'Сб', sun: 'Вс',
}

export interface IWorkingHours {
  isOpen: boolean
  from: string // 'HH:MM'
  to: string
}

export interface IBranch {
  id: string
  name: string    // «Арбат», «Тверская»
  address: string
  phone: string
  isActive: boolean
  workingHours: Record<DayOfWeek, IWorkingHours>
}

export interface IBranchDraft {
  name: string
  address: string
  phone: string
  workingHours: Record<DayOfWeek, IWorkingHours>
}

export interface IBranchErrors {
  name?: string
  address?: string
  phone?: string
}
