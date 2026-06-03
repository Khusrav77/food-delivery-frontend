import type { AdminOrder } from '@/entities/order'
import type { AdminOrderFilters } from './types'

export function applyAdminOrderFilters(
  orders: AdminOrder[],
  filters: AdminOrderFilters,
): AdminOrder[] {
  let result = orders

  if (filters.status !== 'all') {
    result = result.filter((o) => o.status === filters.status)
  }

  const q = filters.search.trim().toLowerCase()
  if (q) {
    result = result.filter(
      (o) =>
        o.number.toLowerCase().includes(q) ||
        o.clientName.toLowerCase().includes(q) ||
        o.payload.address.toLowerCase().includes(q),
    )
  }

  // Сортировка по дате убывания
  return [...result].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}
