import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Category } from './types'
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
      categories.value = await fetchCategories()
    } catch (e) {
      error.value = (e as { message: string }).message ?? 'Ошибка загрузки категорий'
    } finally {
      loading.value = false
    }
  }

  async function addCategory(name: string) {
    const cat = await createCategory({ name })
    categories.value.push(cat)
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

  return { categories, loading, error, fetchAll, addCategory, removeCategory, renameCategory, getById }
})
