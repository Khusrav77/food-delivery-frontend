import type { ICity } from './types'

/**
 * Фиксированный список городов с координатами центра.
 * Санкт-Петербург — первым и по умолчанию: только для него заданы зоны доставки
 * (entities/delivery-zone), поэтому point-in-polygon на нём демонстрируется наглядно.
 */
export const CITIES: ICity[] = [
  { id: 'spb', name: 'Санкт-Петербург', lat: 59.9343, lng: 30.3351, zoom: 12 },
  { id: 'msk', name: 'Москва', lat: 55.7558, lng: 37.6173, zoom: 11 },
  { id: 'kzn', name: 'Казань', lat: 55.7963, lng: 49.1088, zoom: 12 },
  { id: 'ekb', name: 'Екатеринбург', lat: 56.8389, lng: 60.6057, zoom: 12 },
  { id: 'nsk', name: 'Новосибирск', lat: 55.0084, lng: 82.9357, zoom: 11 },
  { id: 'nn', name: 'Нижний Новгород', lat: 56.2965, lng: 43.9361, zoom: 12 },
]

export const DEFAULT_CITY: ICity = CITIES[0]

export function findCity(id: string): ICity {
  return CITIES.find((c) => c.id === id) ?? DEFAULT_CITY
}
