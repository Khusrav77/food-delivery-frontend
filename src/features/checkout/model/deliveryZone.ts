import type { ZoneInfo } from './types'
import { DEFAULT_ETA_MINUTES } from '../config/checkout'

const FREE_ZONE: ZoneInfo = {
  type: 'free',
  deliveryCost: 0,
  minOrder: 600,
  etaMinutes: DEFAULT_ETA_MINUTES,
}
const PAID_ZONE: ZoneInfo = { type: 'paid', deliveryCost: 199, minOrder: 800, etaMinutes: 60 }
const NO_ZONE: ZoneInfo = { type: 'none', deliveryCost: 0, minOrder: 0, etaMinutes: 0 }

/**
 * MOCK-правило определения зоны по адресу — детерминированное, чтобы предсказуемо
 * проверять все три ветки:
 * - улица содержит «далеко» / «far» → доставка недоступна
 * - номер дома > 100 → платная зона
 * - иначе → бесплатная зона
 */
export function resolveZone(street: string, house: string): ZoneInfo {
  const s = street.trim().toLowerCase()
  if (s.includes('далеко') || s.includes('far')) return { ...NO_ZONE }
  const houseNum = parseInt(house, 10)
  if (!Number.isNaN(houseNum) && houseNum > 100) return { ...PAID_ZONE }
  return { ...FREE_ZONE }
}
