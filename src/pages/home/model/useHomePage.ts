import { reactive, computed, ref } from 'vue'
import { useCategoryStore } from '@/entities/category'
import { useProductStore, type Product } from '@/entities/dish'
import { useTagStore } from '@/entities/tag'
import { useScrollSpy } from '@/shared/lib/useScrollSpy'
import { groupIntoSections } from './menuSections'

// header(64) + sticky strip(~56); sections snap just below the strip when scrolled to
const STICKY_OFFSET = 120

export function useHomePage() {
  const categoryStore = useCategoryStore()
  const productStore = useProductStore()
  const tagStore = useTagStore()

  const selectedProduct = ref<Product | null>(null)

  const sections = computed(() =>
    groupIntoSections(productStore.products, categoryStore.categories),
  )

  const sectionIds = computed(() => sections.value.map(s => s.id))

  const { activeId: activeCategoryId, scrollToId } = useScrollSpy(sectionIds, STICKY_OFFSET)

  async function init(): Promise<void> {
    await Promise.all([categoryStore.fetchAll(), tagStore.fetchAll()])
    await productStore.fetchAll()
  }

  function scrollToCategory(id: string) {
    scrollToId(id)
  }

  function openPreview(product: Product): void {
    selectedProduct.value = product
  }

  function closePreview(): void {
    selectedProduct.value = null
  }

  return reactive({
    sections,
    activeCategoryId,
    loading: computed(() => productStore.loading),
    selectedProduct,
    init,
    scrollToCategory,
    openPreview,
    closePreview,
  })
}
