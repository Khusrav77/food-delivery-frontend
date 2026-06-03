import type { IBranchDraft, IBranchErrors, DayOfWeek, IWorkingHours } from './types'
import { DAYS } from './types'

export function defaultWorkingHours(): Record<DayOfWeek, IWorkingHours> {
  return Object.fromEntries(
    DAYS.map((d) => [d, { isOpen: true, from: '10:00', to: '22:00' }]),
  ) as Record<DayOfWeek, IWorkingHours>
}

export function defaultDraft(): IBranchDraft {
  return { name: '', address: '', phone: '', workingHours: defaultWorkingHours() }
}

export function branchToDraft(b: import('./types').IBranch): IBranchDraft {
  return JSON.parse(JSON.stringify({ name: b.name, address: b.address, phone: b.phone, workingHours: b.workingHours }))
}

export function validate(d: IBranchDraft): IBranchErrors {
  const errors: IBranchErrors = {}
  if (!d.name.trim())    errors.name    = 'Введите название точки'
  if (!d.address.trim()) errors.address = 'Введите адрес'
  if (!d.phone.trim())   errors.phone   = 'Введите телефон'
  return errors
}
