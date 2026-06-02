import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IBonusTransaction } from './types'
import { fetchBonusHistory } from '../api/bonusApi'

export const useBonusStore = defineStore('bonus', () => {
  const transactions = ref<IBonusTransaction[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      transactions.value = await fetchBonusHistory()
    } catch (e) {
      error.value = (e as { message?: string }).message ?? 'Ошибка загрузки истории бонусов'
    } finally {
      loading.value = false
    }
  }

  return { transactions, loading, error, fetchAll }
})
