import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Category } from './types'

const mockCategories: Category[] = [
  { id: 'c1', name: 'Роллы', order: 1 },
  { id: 'c2', name: 'Пицца', order: 2 },
  { id: 'c3', name: 'Суши', order: 3 },
  { id: 'c4', name: 'Напитки', order: 4 },
]

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([...mockCategories])

  function addCategory(name: string) {
    const order = categories.value.length + 1
    categories.value.push({ id: `c${Date.now()}`, name, order })
  }

  function removeCategory(id: string) {
    categories.value = categories.value.filter(c => c.id !== id)
  }

  function renameCategory(id: string, name: string) {
    const cat = categories.value.find(c => c.id === id)
    if (cat) cat.name = name
  }

  function getById(id: string) {
    return categories.value.find(c => c.id === id)
  }

  return { categories, addCategory, removeCategory, renameCategory, getById }
})
