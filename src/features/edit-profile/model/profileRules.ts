import type { IUpdateProfilePayload } from '@/entities/user'

export interface ProfileErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+7-8][\d\s\-()]{9,}$/

export function validateProfile(p: IUpdateProfilePayload): ProfileErrors {
  const e: ProfileErrors = {}
  if (!p.firstName.trim()) e.firstName = 'Введите имя'
  if (!p.lastName.trim()) e.lastName = 'Введите фамилию'
  if (p.email && !EMAIL_RE.test(p.email)) e.email = 'Некорректный email'
  if (p.phone && !PHONE_RE.test(p.phone)) e.phone = 'Некорректный телефон'
  return e
}

export function splitName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/)
  const firstName = parts[0] ?? ''
  const lastName = parts.slice(1).join(' ')
  return { firstName, lastName }
}
