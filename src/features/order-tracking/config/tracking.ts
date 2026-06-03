import type { OrderStatus } from '@/entities/order'

// Интервал mock авто-прогресса статуса. Точка замены на реальный polling/WS.
export const PROGRESS_INTERVAL_MS = 5000

// Заказ можно отменить только до передачи курьеру (§1.7).
export const CANCELLABLE_STATUSES: readonly OrderStatus[] = ['accepted', 'cooking']
