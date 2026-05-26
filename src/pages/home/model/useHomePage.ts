import { reactive, computed, ref } from 'vue'
import { useCategoryStore } from '@/entities/category'
import { useProductStore, type Product } from '@/entities/dish'
import { useTagStore } from '@/entities/tag'

export function useHomePage() {
  const categoryStore = useCategoryStore()
  const productStore = useProductStore()
  const tagStore = useTagStore()
  const activeCategoryId = ref<string | null>(null)
  const selectedProduct = ref<Product | null>(null)

  const filteredProducts = computed(() => {
    const visible = productStore.products.filter(
      p => p.isActive && p.menuItems.some(m => m.isActive),
    )
    if (!activeCategoryId.value) return visible
    return visible.filter(p => p.categoryId === activeCategoryId.value)
  })

  async function init(): Promise<void> {
    // Tags must load before products: product mapping resolves tag labels → ids via the tag store.
    await Promise.all([categoryStore.fetchAll(), tagStore.fetchAll()])
    await productStore.fetchAll()
  }

  function openPreview(product: Product): void {
    selectedProduct.value = product
  }

  function closePreview(): void {
    selectedProduct.value = null
  }

  return reactive({
    activeCategoryId,
    filteredProducts,
    loading: computed(() => productStore.loading),
    selectedProduct,
    init,
    openPreview,
    closePreview,
  })
}
