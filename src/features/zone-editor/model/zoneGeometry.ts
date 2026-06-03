import type { IDeliveryZone, IGeoPoint, IZoneDraft } from '@/entities/delivery-zone'

export function defaultDraft(): IZoneDraft {
  return { name: '', type: 'free', deliveryCost: 0, minOrderAmount: 0 }
}

export function zoneToDraft(zone: IDeliveryZone): IZoneDraft {
  return {
    name: zone.name,
    type: zone.type,
    deliveryCost: zone.deliveryCost ?? 0,
    minOrderAmount: zone.minOrderAmount ?? 0,
  }
}

export function isPolygonValid(points: IGeoPoint[]): boolean {
  return points.length >= 3
}

export function validateZoneDraft(draft: IZoneDraft): Partial<Record<keyof IZoneDraft, string>> {
  const errors: Partial<Record<keyof IZoneDraft, string>> = {}
  if (!draft.name.trim()) errors.name = 'Введите название зоны'
  if (draft.type === 'paid') {
    if (draft.deliveryCost < 0) errors.deliveryCost = 'Стоимость не может быть отрицательной'
    if (draft.minOrderAmount < 0) errors.minOrderAmount = 'Сумма не может быть отрицательной'
  }
  return errors
}

export function centroid(points: IGeoPoint[]): IGeoPoint {
  return {
    lat: points.reduce((s, p) => s + p.lat, 0) / points.length,
    lng: points.reduce((s, p) => s + p.lng, 0) / points.length,
  }
}
