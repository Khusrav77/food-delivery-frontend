import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IAnalyticsReport, AnalyticsPeriod } from './types'
import { fetchAnalytics } from '../api/analyticsApi'

export const useAnalyticsStore = defineStore('analytics', () => {
  const report  = ref<IAnalyticsReport | null>(null)
  const loading = ref(false)
  const error   = ref<string | null>(null)

  async function fetch(period: AnalyticsPeriod): Promise<void> {
    loading.value = true
    error.value = null
    try { report.value = await fetchAnalytics(period) }
    catch (e) { error.value = (e as { message?: string }).message ?? 'Ошибка загрузки' }
    finally { loading.value = false }
  }

  return { report, loading, error, fetch }
})
