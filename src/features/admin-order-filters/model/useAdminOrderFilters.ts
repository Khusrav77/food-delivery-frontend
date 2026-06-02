import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminOrderStore } from '@/entities/order'
import { applyAdminOrderFilters } from './filterRules'
import type { AdminOrderStatusFilter } from './types'

export function useAdminOrderFilters() {
  const store = useAdminOrderStore()
  const { list } = storeToRefs(store)

  const status = ref<AdminOrderStatusFilter>('all')
  const search = ref('')

  const filtered = computed(() =>
    applyAdminOrderFilters(list.value, { status: status.value, search: search.value }),
  )

  return { status, search, filtered }
}
