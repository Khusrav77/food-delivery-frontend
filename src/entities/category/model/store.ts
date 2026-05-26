import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Category } from './types'
import { sortByPosition, diffChanged } from '@/shared/lib/position'
import {
  fetchCategories,
  createCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory,
} from '../api/categoriesApi'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      categories.value = sortByPosition(await fetchCategories())
    } catch (e) {
      error.value = (e as { message: string }).message ?? 'Ошибка загрузки категорий'
    } finally {
      loading.value = false
    }
  }

  async function addCategory(name: string) {
    const cat = await createCategory({ name })
    categories.value = sortByPosition([...categories.value, cat])
  }

  /** Persists a new category order; sends a PUT only for categories whose position changed. */
  async function reorder(orderedIds: string[]) {
    const byId = new Map(categories.value.map(c => [c.id, c]))
    const ordered = orderedIds
      .map(id => byId.get(id))
      .filter((c): c is Category => c !== undefined)

    const changes = diffChanged(ordered)
    if (changes.length === 0) return

    // Clone for rollback: optimistic update mutates positions in place below.
    const snapshot = categories.value.map(c => ({ ...c }))
    for (const { id, position } of changes) {
      const cat = byId.get(id)
      if (cat) cat.position = position
    }
    categories.value = sortByPosition(categories.value)

    try {
      await Promise.all(
        changes.map(({ id, position }) =>
          apiUpdateCategory(id, { name: byId.get(id)!.name, position }),
        ),
      )
    } catch (e) {
      categories.value = snapshot
      throw e
    }
  }

  async function removeCategory(id: string) {
    await deleteCategory(id)
    categories.value = categories.value.filter(c => c.id !== id)
  }

  async function renameCategory(id: string, name: string) {
    const updated = await apiUpdateCategory(id, { name })
    const idx = categories.value.findIndex(c => c.id === id)
    if (idx !== -1) categories.value[idx] = updated
  }

  function getById(id: string) {
    return categories.value.find(c => c.id === id)
  }

  return { categories, loading, error, fetchAll, addCategory, removeCategory, renameCategory, reorder, getById }
})
