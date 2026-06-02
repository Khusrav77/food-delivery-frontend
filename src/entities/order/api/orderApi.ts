import type { PlaceOrderPayload, PlacedOrder } from '../model/types'

// MOCK: бэкенд-эндпоинта заказа ещё нет.
// Заменить на: const res = await http.post<PlacedOrder>('/orders', payload); return res.data
export async function createOrder(payload: PlaceOrderPayload): Promise<PlacedOrder> {
  await new Promise((r) => setTimeout(r, 700))
  const num = Math.floor(1000 + Math.random() * 9000)
  return {
    id: crypto.randomUUID(),
    number: `A-${num}`,
    status: 'accepted',
    total: payload.total,
    etaMinutes: payload.etaMinutes,
    createdAt: new Date().toISOString(),
    payload,
  }
}
