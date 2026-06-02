import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IBonusProgramSettings } from './types'
import { fetchBonusProgram, updateBonusProgram } from '../api/bonusProgramApi'

export const useBonusProgramStore = defineStore('bonusProgram', () => {
  const settings = ref<IBonusProgramSettings | null>(null)
  const loading  = ref(false)
  const saving   = ref(false)
  const error    = ref<string | null>(null)

  async function fetch(): Promise<void> {
    loading.value = true
    error.value = null
    try { settings.value = await fetchBonusProgram() }
    catch (e) { error.value = (e as { message?: string }).message ?? 'Ошибка загрузки' }
    finally { loading.value = false }
  }

  async function save(payload: IBonusProgramSettings): Promise<void> {
    saving.value = true
    try { settings.value = await updateBonusProgram(payload) }
    finally { saving.value = false }
  }

  return { settings, loading, saving, error, fetch, save }
})
