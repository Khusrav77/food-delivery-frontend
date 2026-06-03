import { detectBrand } from '@/entities/card'
import type { CardBrand } from '@/entities/card'
import type { CardDraft, CardDraftErrors } from './types'
import type { CreateCardPayload } from '@/entities/card'

export function defaultDraft(): CardDraft {
  return { number: '', expMonth: '', expYear: '', holder: '' }
}

export function luhnCheck(number: string): boolean {
  const digits = number.replace(/\s/g, '')
  if (!/^\d{13,19}$/.test(digits)) return false
  let sum = 0
  let isEven = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10)
    if (isEven) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    isEven = !isEven
  }
  return sum % 10 === 0
}

export function detectCardBrand(number: string): CardBrand {
  return detectBrand(number)
}

export function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

export function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export function validateDraft(d: CardDraft): CardDraftErrors {
  const e: CardDraftErrors = {}
  const clean = d.number.replace(/\s/g, '')
  if (!clean) {
    e.number = 'Введите номер карты'
  } else if (!luhnCheck(clean)) {
    e.number = 'Неверный номер карты'
  }
  if (!d.expMonth || !d.expYear) {
    e.expMonth = 'Введите срок действия'
  } else {
    const month = parseInt(d.expMonth, 10)
    const year = parseInt(`20${d.expYear}`, 10)
    const now = new Date()
    if (
      month < 1 ||
      month > 12 ||
      year < now.getFullYear() ||
      (year === now.getFullYear() && month < now.getMonth() + 1)
    ) {
      e.expMonth = 'Карта истекла или неверный срок'
    }
  }
  if (!d.holder.trim()) {
    e.holder = 'Введите имя держателя'
  }
  return e
}

export function toPayload(d: CardDraft): CreateCardPayload {
  return {
    number: d.number,
    expMonth: d.expMonth,
    expYear: d.expYear,
    holder: d.holder.trim(),
  }
}
