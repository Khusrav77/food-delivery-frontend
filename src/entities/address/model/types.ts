export type AddressLabel = 'home' | 'work' | 'other'

export interface IAddress {
  id: string
  label: AddressLabel
  street: string
  house: string
  apartment: string
  entrance: string
  floor: string
  comment: string
  isPrimary: boolean
}
