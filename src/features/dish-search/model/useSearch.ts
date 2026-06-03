import { ref, computed } from 'vue'
import { useProductStore, type Product } from '@/entities/dish'

export function useSearch() {
  const productStore = useProductStore()

  const query = ref('')
  const selectedCategoryId = ref<string | null>(null)
  const selectedTagId = ref<string | null>(null)

  const results = computed<Product[]>(() => {
    let list = productStore.products.filter(p => p.isActive)

    const q = query.value.trim().toLowerCase()
    if (q) {
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      )
    }

    if (selectedCategoryId.value !== null) {
      list = list.filter(p => p.categoryId === selectedCategoryId.value)
    }

    if (selectedTagId.value !== null) {
      const tid = selectedTagId.value
      list = list.filter(p => p.menuItems.some(item => item.tagIds.includes(tid)))
    }

    return list
  })

  const hasFilters = computed(
    () => selectedCategoryId.value !== null || selectedTagId.value !== null,
  )

  function clearFilters(): void {
    selectedCategoryId.value = null
    selectedTagId.value = null
  }

  return {
    query,
    selectedCategoryId,
    selectedTagId,
    results,
    hasFilters,
    clearFilters,
  }
}
