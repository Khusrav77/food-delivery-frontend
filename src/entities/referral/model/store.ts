import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IReferralInfo } from './types'
import { fetchReferralInfo } from '../api/referralApi'

export const useReferralStore = defineStore('referral', () => {
  const info = ref<IReferralInfo | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchInfo(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      info.value = await fetchReferralInfo()
    } catch (e) {
      error.value = (e as { message?: string }).message ?? 'Ошибка загрузки реферальной программы'
    } finally {
      loading.value = false
    }
  }

  return { info, loading, error, fetchInfo }
})
