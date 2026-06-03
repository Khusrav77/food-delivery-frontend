import type { ZoneInfo } from '../model/types'
import { resolveZone } from '../model/deliveryZone'

// MOCK: эндпоинта определения зоны ещё нет (админ-зоны §2.4 не построены).
// Заменить на: const res = await http.get<ZoneInfo>('/delivery-zones/detect', { params: { street, house } }); return res.data
export async function detectZone(street: string, house: string): Promise<ZoneInfo> {
  await new Promise((r) => setTimeout(r, 500))
  return resolveZone(street, house)
}
