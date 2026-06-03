import { ref, watch, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore, type Product } from '@/entities/dish'
import { useCategoryStore } from '@/entities/category'
import { useTagStore } from '@/entities/tag'
import { useSearch } from '@/features/dish-search'

export function useSearchPage() {
  const route = useRoute()
  const router = useRouter()

  const productStore = useProductStore()
  const categoryStore = useCategoryStore()
  const tagStore = useTagStore()

  const search = useSearch()
  const filtersOpen = ref(false)
  const selectedProduct = ref<Product | null>(null)

  function openPreview(product: Product): void {
    selectedProduct.value = product
  }

  function closePreview(): void {
    selectedProduct.value = null
  }

  function close(): void {
    if (window.history.length > 1) router.back()
    else router.push('/')
  }

  watch(search.query, (q) => {
    router.replace({ query: { q: q || undefined } })
  })

  onMounted(async () => {
    search.query.value = typeof route.query.q === 'string' ? route.query.q : ''
    const tasks: Promise<void>[] = [categoryStore.fetchAll(), tagStore.fetchAll()]
    if (productStore.products.length === 0) tasks.push(productStore.fetchAll())
    await Promise.all(tasks)
  })

  return reactive({
    query: search.query,
    selectedCategoryId: search.selectedCategoryId,
    selectedTagId: search.selectedTagId,
    results: search.results,
    hasFilters: search.hasFilters,
    clearFilters: search.clearFilters,
    filtersOpen,
    selectedProduct,
    openPreview,
    closePreview,
    close,
    loading: productStore.loading,
    categories: categoryStore.categories,
    tags: tagStore.tags,
  })
}
