import type { ZoneType } from '@/entities/delivery-zone'

/** Редактируемое состояние формы выбора адреса. */
export interface LocationDraft {
  cityId: string
  street: string
  house: string
  apartment: string
  entrance: string
  floor: string
  comment: string
  lat: number
  lng: number
}

export interface LocationDraftErrors {
  street?: string
  house?: string
}

/** Результат определения зоны доставки по координатам пина. */
export interface ZoneResult {
  type: ZoneType
  name: string
  deliveryCost: number
  minOrderAmount: number
}
