import type { OrderStatus } from '@/entities/order'

export type AdminOrderStatusFilter = OrderStatus | 'all'

export interface AdminOrderFilters {
  status: AdminOrderStatusFilter
  search: string // по номеру или имени клиента
}
