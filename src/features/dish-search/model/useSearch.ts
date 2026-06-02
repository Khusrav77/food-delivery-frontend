import { ref, computed } from 'vue'
import { useProductStore, getMinPrice, type Product } from '@/entities/dish'

export function useSearch() {
  const productStore = useProductStore()

  const query = ref('')
  const minPrice = ref<number | null>(null)
  const maxPrice = ref<number | null>(null)
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

    if (minPrice.value !== null) {
      list = list.filter(p => getMinPrice(p) >= minPrice.value!)
    }

    if (maxPrice.value !== null) {
      list = list.filter(p => getMinPrice(p) <= maxPrice.value!)
    }

    return list
  })

  const hasFilters = computed(
    () =>
      minPrice.value !== null ||
      maxPrice.value !== null ||
      selectedCategoryId.value !== null ||
      selectedTagId.value !== null,
  )

  function clearFilters(): void {
    minPrice.value = null
    maxPrice.value = null
    selectedCategoryId.value = null
    selectedTagId.value = null
  }

  return {
    query,
    minPrice,
    maxPrice,
    selectedCategoryId,
    selectedTagId,
    results,
    hasFilters,
    clearFilters,
  }
}
