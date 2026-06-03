import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IPromoCode } from './types'
import { fetchPromoCodes } from '../api/promoApi'

export const usePromoStore = defineStore('promo', () => {
  const list = ref<IPromoCode[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      list.value = await fetchPromoCodes()
    } catch (e) {
      error.value = (e as { message?: string }).message ?? 'Ошибка загрузки промокодов'
    } finally {
      loading.value = false
    }
  }

  return { list, loading, error, fetchAll }
})
