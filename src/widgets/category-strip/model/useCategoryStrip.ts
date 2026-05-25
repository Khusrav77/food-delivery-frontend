import { storeToRefs } from 'pinia'
import { useCategoryStore } from '@/entities/category'

export function useCategoryStrip() {
  const store = useCategoryStore()
  const { categories, loading, error } = storeToRefs(store)
  return { categories, loading, error }
}
