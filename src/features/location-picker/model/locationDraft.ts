import type { ICity, IDeliveryLocation } from '@/entities/delivery-location'
import type { IDeliveryZone } from '@/entities/delivery-zone'
import type { GeoSuggestion } from '@/shared/api/nominatim'
import { pointInPolygon } from '@/shared/lib/geo'
import type { LocationDraft, LocationDraftErrors, ZoneResult } from './types'

/** Пустой драфт с центром на выбранном городе. */
export function defaultDraft(city: ICity): LocationDraft {
  return {
    cityId: city.id,
    street: '',
    house: '',
    apartment: '',
    entrance: '',
    floor: '',
    comment: '',
    lat: city.lat,
    lng: city.lng,
  }
}

/** Восстановить драфт из сохранённой локации. */
export function draftFromLocation(loc: IDeliveryLocation): LocationDraft {
  return {
    cityId: loc.cityId,
    street: loc.street,
    house: loc.house,
    apartment: loc.apartment,
    entrance: loc.entrance,
    floor: loc.floor,
    comment: loc.comment,
    lat: loc.lat,
    lng: loc.lng,
  }
}

/** Слить подсказку геокодера в драфт (улица/дом/координаты). */
export function applySuggestion(d: LocationDraft, s: GeoSuggestion): LocationDraft {
  return {
    ...d,
    street: s.street || d.street,
    house: s.house || d.house,
    lat: s.lat,
    lng: s.lng,
  }
}

export function validateDraft(d: LocationDraft): LocationDraftErrors {
  const e: LocationDraftErrors = {}
  if (!d.street.trim()) e.street = 'Укажите улицу'
  if (!d.house.trim()) e.house = 'Укажите дом'
  return e
}

export function draftToLocation(d: LocationDraft, cityName: string): IDeliveryLocation {
  return {
    cityId: d.cityId,
    cityName,
    street: d.street.trim(),
    house: d.house.trim(),
    apartment: d.apartment.trim(),
    entrance: d.entrance.trim(),
    floor: d.floor.trim(),
    comment: d.comment.trim(),
    lat: d.lat,
    lng: d.lng,
  }
}

/**
 * Определить зону доставки попаданием точки в полигон.
 * Возвращает первую зону, в которую попал пин, либо null (вне зон доставки).
 */
export function resolveZoneByPoint(
  point: { lat: number; lng: number },
  zones: IDeliveryZone[],
): ZoneResult | null {
  for (const zone of zones) {
    if (pointInPolygon(point, zone.polygon)) {
      return {
        type: zone.type,
        name: zone.name,
        deliveryCost: zone.deliveryCost ?? 0,
        minOrderAmount: zone.minOrderAmount ?? 0,
      }
    }
  }
  return null
}
