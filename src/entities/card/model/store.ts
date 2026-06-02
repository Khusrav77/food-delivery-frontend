import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ICard } from './types'
import {
  fetchCards,
  createCard,
  removeCard,
  setPrimaryCard,
  type CreateCardPayload,
} from '../api/cardApi'

export const useCardStore = defineStore('card', () => {
  const list = ref<ICard[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const primary = computed(() => list.value.find((c) => c.isPrimary) ?? list.value[0] ?? null)

  async function fetchAll(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      list.value = await fetchCards()
    } catch (e) {
      error.value = (e as { message?: string }).message ?? 'Ошибка загрузки карт'
    } finally {
      loading.value = false
    }
  }

  async function create(payload: CreateCardPayload): Promise<void> {
    const card = await createCard(payload)
    list.value.push(card)
  }

  async function remove(id: string): Promise<void> {
    await removeCard(id)
    const wasPrimary = list.value.find((c) => c.id === id)?.isPrimary ?? false
    list.value = list.value.filter((c) => c.id !== id)
    if (wasPrimary && list.value.length > 0) list.value[0].isPrimary = true
  }

  async function setPrimary(id: string): Promise<void> {
    await setPrimaryCard(id)
    list.value = list.value.map((c) => ({ ...c, isPrimary: c.id === id }))
  }

  return { list, loading, error, primary, fetchAll, create, remove, setPrimary }
})
