import type { PlacedOrder, OrderStatus } from '@/entities/order'

export type StatusFilter = OrderStatus | 'all'
export type SortDirection = 'desc' | 'asc'

export function applyFilters(
  orders: PlacedOrder[],
  status: StatusFilter,
  sort: SortDirection,
): PlacedOrder[] {
  let result = status === 'all' ? orders : orders.filter((o) => o.status === status)
  result = [...result].sort((a, b) => {
    const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    return sort === 'desc' ? diff : -diff
  })
  return result
}
