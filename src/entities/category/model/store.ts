import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Category } from './types'

const NOW = '2024-01-01T00:00:00.000Z'

const mockCategories: Category[] = [
  { id: 'c1', name: 'Роллы', imageUrl: null, position: 1, createdAt: NOW, updatedAt: NOW },
  { id: 'c2', name: 'Пицца', imageUrl: null, position: 2, createdAt: NOW, updatedAt: NOW },
  { id: 'c3', name: 'Суши', imageUrl: null, position: 3, createdAt: NOW, updatedAt: NOW },
  { id: 'c4', name: 'Напитки', imageUrl: null, position: 4, createdAt: NOW, updatedAt: NOW },
]

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([...mockCategories])

  function addCategory(name: string) {
    const position = categories.value.length + 1
    const now = new Date().toISOString()
    categories.value.push({ id: `c${Date.now()}`, name, imageUrl: null, position, createdAt: now, updatedAt: now })
  }

  function removeCategory(id: string) {
    categories.value = categories.value.filter(c => c.id !== id)
  }

  function renameCategory(id: string, name: string) {
    const cat = categories.value.find(c => c.id === id)
    if (cat) { cat.name = name; cat.updatedAt = new Date().toISOString() }
  }

  function getById(id: string) {
    return categories.value.find(c => c.id === id)
  }

  return { categories, addCategory, removeCategory, renameCategory, getById }
})
