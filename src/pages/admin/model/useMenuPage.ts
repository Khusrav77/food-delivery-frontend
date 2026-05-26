import { ref, computed, reactive } from 'vue'
import { useProductStore, type Product } from '@/entities/dish'
import { useTagStore } from '@/entities/tag'
import { useCategoryStore } from '@/entities/category'
import { useMenuFilter } from '@/features/menu-filter'

export function useMenuPage() {
  const productStore = useProductStore()
  const tagStore = useTagStore()
  const categoryStore = useCategoryStore()
  const filter = useMenuFilter()

  const showDishForm = ref(false)
  const editingProduct = ref<Product | null>(null)
  const showCategoryManager = ref(false)
  const showTagManager = ref(false)

  async function init() {
    // Tags must load first — their labels are used to resolve tagIds when mapping products
    await tagStore.fetchAll()
    await Promise.all([categoryStore.fetchAll(), productStore.fetchAll()])
  }

  function openCreate() {
    editingProduct.value = null
    showDishForm.value = true
  }

  function openEdit(product: Product) {
    editingProduct.value = product
    showDishForm.value = true
  }

  function closeDishForm() {
    showDishForm.value = false
    editingProduct.value = null
  }

  function openCategories() { showCategoryManager.value = true }
  function closeCategories() { showCategoryManager.value = false }
  function openTags() { showTagManager.value = true }
  function closeTags() { showTagManager.value = false }

  return reactive({
    products: computed(() => productStore.products),
    search: filter.search,
    activeCategoryId: filter.activeCategoryId,
    activeTagIds: filter.activeTagIds,
    filteredProducts: filter.filteredProducts,
    showDishForm,
    editingProduct,
    showCategoryManager,
    showTagManager,
    init,
    openCreate,
    openEdit,
    closeDishForm,
    openCategories,
    closeCategories,
    openTags,
    closeTags,
  })
}