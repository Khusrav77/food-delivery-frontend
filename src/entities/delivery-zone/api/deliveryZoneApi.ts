import type { IDeliveryZone, IGeoPoint, IZoneDraft } from '../model/types'

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const MOCK_ZONES: IDeliveryZone[] = [
  {
    id: 'z-1',
    name: 'Центр',
    type: 'free',
    polygon: [
      { lat: 59.957, lng: 30.295 },
      { lat: 59.957, lng: 30.370 },
      { lat: 59.915, lng: 30.370 },
      { lat: 59.915, lng: 30.295 },
    ],
  },
  {
    id: 'z-2',
    name: 'Васильевский остров',
    type: 'paid',
    deliveryCost: 149,
    minOrderAmount: 1000,
    polygon: [
      { lat: 59.955, lng: 30.190 },
      { lat: 59.955, lng: 30.295 },
      { lat: 59.918, lng: 30.295 },
      { lat: 59.918, lng: 30.190 },
    ],
  },
  {
    id: 'z-3',
    name: 'Петроградская',
    type: 'paid',
    deliveryCost: 199,
    minOrderAmount: 1200,
    polygon: [
      { lat: 59.998, lng: 30.255 },
      { lat: 59.998, lng: 30.345 },
      { lat: 59.957, lng: 30.345 },
      { lat: 59.957, lng: 30.255 },
    ],
  },
]

function cloneZone(z: IDeliveryZone): IDeliveryZone {
  return { ...z, polygon: z.polygon.map((p) => ({ ...p })) }
}

// MOCK: заменить на http.get<IDeliveryZone[]>('/admin/delivery-zones')
export async function fetchDeliveryZones(): Promise<IDeliveryZone[]> {
  await delay(350)
  return MOCK_ZONES.map(cloneZone)
}

// MOCK: заменить на http.post<IDeliveryZone>('/admin/delivery-zones', payload)
export async function createDeliveryZone(
  draft: IZoneDraft,
  polygon: IGeoPoint[],
): Promise<IDeliveryZone> {
  await delay(400)
  const zone: IDeliveryZone = {
    id: `z-${Date.now()}`,
    name: draft.name.trim(),
    type: draft.type,
    polygon: polygon.map((p) => ({ ...p })),
    ...(draft.type === 'paid'
      ? { deliveryCost: draft.deliveryCost, minOrderAmount: draft.minOrderAmount }
      : {}),
  }
  MOCK_ZONES.push(zone)
  return cloneZone(zone)
}

// MOCK: заменить на http.patch<IDeliveryZone>(`/admin/delivery-zones/${id}`, payload)
export async function updateDeliveryZone(id: string, draft: IZoneDraft): Promise<IDeliveryZone> {
  await delay(350)
  const zone = MOCK_ZONES.find((z) => z.id === id)
  if (!zone) return Promise.reject({ message: 'Зона не найдена' })
  zone.name = draft.name.trim()
  zone.type = draft.type
  zone.deliveryCost = draft.type === 'paid' ? draft.deliveryCost : undefined
  zone.minOrderAmount = draft.type === 'paid' ? draft.minOrderAmount : undefined
  return cloneZone(zone)
}

// MOCK: заменить на http.patch<IDeliveryZone>(`/admin/delivery-zones/${id}/polygon`, { polygon })
export async function updateDeliveryZonePolygon(
  id: string,
  polygon: IGeoPoint[],
): Promise<IDeliveryZone> {
  await delay(350)
  const zone = MOCK_ZONES.find((z) => z.id === id)
  if (!zone) return Promise.reject({ message: 'Зона не найдена' })
  zone.polygon = polygon.map((p) => ({ ...p }))
  return cloneZone(zone)
}

// MOCK: заменить на http.delete(`/admin/delivery-zones/${id}`)
export async function deleteDeliveryZone(id: string): Promise<void> {
  await delay(300)
  const idx = MOCK_ZONES.findIndex((z) => z.id === id)
  if (idx === -1) return Promise.reject({ message: 'Зона не найдена' })
  MOCK_ZONES.splice(idx, 1)
}
