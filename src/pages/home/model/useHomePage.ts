import { reactive, computed, ref } from 'vue'
import { useCategoryStore } from '@/entities/category'
import { useProductStore } from '@/entities/dish'

export function useHomePage() {
  const categoryStore = useCategoryStore()
  const productStore = useProductStore()
  const activeCategoryId = ref<string | null>(null)

  const filteredProducts = computed(() => {
    const visible = productStore.products.filter(
      p => p.isActive && p.menuItems.some(m => m.isActive),
    )
    if (!activeCategoryId.value) return visible
    return visible.filter(p => p.categoryId === activeCategoryId.value)
  })

  async function init(): Promise<void> {
    await Promise.all([
      categoryStore.fetchAll(),
      productStore.fetchAll(),
    ])
  }

  return reactive({
    activeCategoryId,
    filteredProducts,
    loading: computed(() => productStore.loading),
    init,
  })
}
