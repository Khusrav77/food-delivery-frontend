export type CardBrand = 'visa' | 'mastercard' | 'mir' | 'unknown'

export interface ICard {
  id: string
  brand: CardBrand
  last4: string
  expMonth: string
  expYear: string
  holder: string
  isPrimary: boolean
}
