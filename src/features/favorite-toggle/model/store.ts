import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'foo:favorites'

function loadIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

export const useFavoriteStore = defineStore('favorite', () => {
  const ids = ref<Set<string>>(new Set(loadIds()))

  const count = computed(() => ids.value.size)
  const isFavorite = computed(() => (productId: string) => ids.value.has(productId))

  function persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids.value]))
  }

  function toggle(productId: string): void {
    const next = new Set(ids.value)
    if (next.has(productId)) next.delete(productId)
    else next.add(productId)
    ids.value = next
    persist()
  }

  return { ids, count, isFavorite, toggle }
})
