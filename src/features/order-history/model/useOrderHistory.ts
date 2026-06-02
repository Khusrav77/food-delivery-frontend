import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useOrderStore } from '@/entities/order'
import { applyFilters, type StatusFilter, type SortDirection } from './orderFilters'

export function useOrderHistory() {
  const store = useOrderStore()
  const { list, loadingList, listError } = storeToRefs(store)

  const statusFilter = ref<StatusFilter>('all')
  const sortDirection = ref<SortDirection>('desc')

  const filtered = computed(() =>
    applyFilters(list.value, statusFilter.value, sortDirection.value),
  )

  return {
    orders: filtered,
    all: list,
    loading: loadingList,
    error: listError,
    statusFilter,
    sortDirection,
    fetchAll: store.fetchAll,
  }
}
