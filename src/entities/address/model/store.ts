import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { IAddress } from './types'
import { fetchAddresses } from '../api/addressApi'

export const useAddressStore = defineStore('address', () => {
  const list = ref<IAddress[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const primary = computed(
    () => list.value.find((a) => a.isPrimary) ?? list.value[0] ?? null,
  )

  async function fetchAll(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      list.value = await fetchAddresses()
    } catch (e) {
      error.value = (e as { message?: string }).message ?? 'Ошибка загрузки адресов'
    } finally {
      loading.value = false
    }
  }

  return { list, loading, error, primary, fetchAll }
})
