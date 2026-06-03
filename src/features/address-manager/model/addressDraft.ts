import type { AddressLabel, IAddress } from '@/entities/address'
import type { CreateAddressPayload } from '@/entities/address'

export interface AddressDraft {
  label: AddressLabel
  street: string
  house: string
  apartment: string
  entrance: string
  floor: string
  comment: string
}

export interface AddressDraftErrors {
  street?: string
  house?: string
}

export function defaultDraft(): AddressDraft {
  return { label: 'home', street: '', house: '', apartment: '', entrance: '', floor: '', comment: '' }
}

export function draftFromAddress(addr: IAddress): AddressDraft {
  return {
    label: addr.label,
    street: addr.street,
    house: addr.house,
    apartment: addr.apartment,
    entrance: addr.entrance,
    floor: addr.floor,
    comment: addr.comment,
  }
}

export function validateDraft(d: AddressDraft): AddressDraftErrors {
  const e: AddressDraftErrors = {}
  if (!d.street.trim()) e.street = 'Укажите улицу'
  if (!d.house.trim()) e.house = 'Укажите номер дома'
  return e
}

export function toPayload(d: AddressDraft): CreateAddressPayload {
  return {
    label: d.label,
    street: d.street.trim(),
    house: d.house.trim(),
    apartment: d.apartment.trim(),
    entrance: d.entrance.trim(),
    floor: d.floor.trim(),
    comment: d.comment.trim(),
  }
}

export const ADDRESS_LABEL_NAMES: Record<AddressLabel, string> = {
  home: 'Дом',
  work: 'Работа',
  other: 'Другое',
}
