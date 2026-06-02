import type { OrderStatus } from '@/entities/order'
import { CANCELLABLE_STATUSES } from '../config/tracking'

// Активна ли кнопка «Отменить заказ» для данного статуса.
export function canCancel(status: OrderStatus): boolean {
  return CANCELLABLE_STATUSES.includes(status)
}

// Терминальные статусы — авто-прогресс на них останавливается.
export function isFinished(status: OrderStatus): boolean {
  return status === 'delivered' || status === 'cancelled'
}
