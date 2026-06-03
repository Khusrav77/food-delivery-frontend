import type { CardBrand } from '../model/types'

const BRAND_RULES: { brand: CardBrand; pattern: RegExp }[] = [
  { brand: 'mir', pattern: /^220[0-4]/ },
  { brand: 'visa', pattern: /^4/ },
  { brand: 'mastercard', pattern: /^(5[1-5]|2[2-7])/ },
]

export function detectBrand(number: string): CardBrand {
  const clean = number.replace(/\s/g, '')
  for (const { brand, pattern } of BRAND_RULES) {
    if (pattern.test(clean)) return brand
  }
  return 'unknown'
}

export const BRAND_NAMES: Record<CardBrand, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  mir: 'МИР',
  unknown: 'Карта',
}
