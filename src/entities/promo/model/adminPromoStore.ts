import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IPromoCode, IPromoCodeDraft } from './types'
import { fetchPromoCodes, createPromoCode, togglePromoCode } from '../api/promoCodeApi'

export const useAdminPromoStore = defineStore('adminPromo', () => {
  const list    = ref<IPromoCode[]>([])
  const loading = ref(false)
  const error   = ref<string | null>(null)

  function sync(promo: IPromoCode): void {
    const i = list.value.findIndex((p) => p.id === promo.id)
    if (i !== -1) list.value[i] = promo
    else list.value.unshift(promo)
  }

  async function fetchAll(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      list.value = await fetchPromoCodes()
    } catch (e) {
      error.value = (e as { message?: string }).message ?? 'Ошибка загрузки'
    } finally {
      loading.value = false
    }
  }

  async function create(draft: IPromoCodeDraft): Promise<IPromoCode> {
    const promo = await createPromoCode(draft)
    sync(promo)
    return promo
  }

  async function toggle(id: string): Promise<void> {
    const promo = await togglePromoCode(id)
    sync(promo)
  }

  return { list, loading, error, fetchAll, create, toggle }
})
