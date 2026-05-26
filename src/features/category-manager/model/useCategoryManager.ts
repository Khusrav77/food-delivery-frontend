import { ref, watch } from 'vue'
import { useCategoryStore, type Category } from '@/entities/category'
import { useProductStore } from '@/entities/dish'

export function useCategoryManager() {
  const categoryStore = useCategoryStore()
  const productStore = useProductStore()

  const newName = ref('')
  const editingId = ref<string | null>(null)
  const editingName = ref('')

  // Local drag-mutable copy; resyncs whenever the store list changes (add/rename/remove/reorder).
  const orderedCategories = ref<Category[]>([...categoryStore.categories])
  watch(() => categoryStore.categories, next => {
    orderedCategories.value = [...next]
  })

  async function persistOrder() {
    try {
      await categoryStore.reorder(orderedCategories.value.map(c => c.id))
    } catch {
      // Store rolled back on failure; the watch above resyncs the local list.
    }
  }

  function startEdit(id: string, name: string) {
    editingId.value = id
    editingName.value = name
  }

  async function confirmEdit(id: string) {
    if (editingName.value.trim()) await categoryStore.renameCategory(id, editingName.value.trim())
    editingId.value = null
  }

  async function addCategory() {
    if (!newName.value.trim()) return
    await categoryStore.addCategory(newName.value.trim())
    newName.value = ''
  }

  async function remove(id: string) {
    const count = productStore.products.filter(d => d.categoryId === id).length
    if (count > 0) {
      const ok = confirm(`Категория содержит ${count} блюд. Продолжить удаление?`)
      if (!ok) return
    }
    await categoryStore.removeCategory(id)
    // Рефетч продуктов — сервер определяет что происходит с блюдами при удалении категории
    await productStore.fetchAll()
  }

  return {
    categoryStore,
    productStore,
    orderedCategories,
    persistOrder,
    newName,
    editingId,
    editingName,
    startEdit,
    confirmEdit,
    addCategory,
    remove,
  }
}