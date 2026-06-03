/**
 * Геокодинг через публичный OpenStreetMap Nominatim.
 * Отдельно от shared/api/http.ts — это внешний сервис без JWT и со своим base URL.
 * Лимиты: ≤1 запрос/сек (вызывающий код обязан дебаунсить). Используем для демо.
 */

const BASE = 'https://nominatim.openstreetmap.org'

/** Нормализованная подсказка адреса для UI. */
export interface GeoSuggestion {
  /** Человекочитаемая строка для дропдауна. */
  label: string
  street: string
  house: string
  city: string
  lat: number
  lng: number
}

interface NominatimAddress {
  road?: string
  pedestrian?: string
  house_number?: string
  city?: string
  town?: string
  village?: string
  state?: string
}

interface NominatimPlace {
  lat: string
  lon: string
  display_name: string
  address?: NominatimAddress
}

function toSuggestion(p: NominatimPlace): GeoSuggestion {
  const a = p.address ?? {}
  return {
    label: p.display_name,
    street: a.road ?? a.pedestrian ?? '',
    house: a.house_number ?? '',
    city: a.city ?? a.town ?? a.village ?? a.state ?? '',
    lat: parseFloat(p.lat),
    lng: parseFloat(p.lon),
  }
}

/** Поиск адреса строкой. `city` сужает контекст запроса. */
export async function searchPlaces(query: string, city?: string): Promise<GeoSuggestion[]> {
  const q = city ? `${city}, ${query}` : query
  const params = new URLSearchParams({
    q,
    format: 'jsonv2',
    addressdetails: '1',
    limit: '6',
    'accept-language': 'ru',
  })
  const res = await fetch(`${BASE}/search?${params}`)
  if (!res.ok) throw new Error('Ошибка геокодинга')
  const data = (await res.json()) as NominatimPlace[]
  return data.map(toSuggestion)
}

/** Обратный геокодинг: координаты → адрес. */
export async function reverseGeocode(lat: number, lng: number): Promise<GeoSuggestion | null> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'jsonv2',
    addressdetails: '1',
    'accept-language': 'ru',
  })
  const res = await fetch(`${BASE}/reverse?${params}`)
  if (!res.ok) throw new Error('Ошибка геокодинга')
  const data = (await res.json()) as NominatimPlace & { error?: string }
  if (data.error) return null
  return toSuggestion(data)
}
