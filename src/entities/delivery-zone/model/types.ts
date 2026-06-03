export type ZoneType = 'free' | 'paid' | 'none'

export interface IGeoPoint {
  lat: number
  lng: number
}

export interface IDeliveryZone {
  id: string
  name: string
  type: ZoneType
  polygon: IGeoPoint[]
  deliveryCost?: number
  minOrderAmount?: number
}

export interface IZoneDraft {
  name: string
  type: ZoneType
  deliveryCost: number
  minOrderAmount: number
}

export const ZONE_TYPE_META: Record<ZoneType, {
  label: string
  color: string
  fillColor: string
  textClass: string
  bgClass: string
  borderClass: string
}> = {
  free: {
    label: 'Бесплатная',
    color: '#10b981',
    fillColor: '#10b98126',
    textClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
  },
  paid: {
    label: 'Платная',
    color: '#f59e0b',
    fillColor: '#f59e0b26',
    textClass: 'text-amber-700',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
  },
  none: {
    label: 'Нет доставки',
    color: '#ef4444',
    fillColor: '#ef444426',
    textClass: 'text-red-700',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-200',
  },
}
