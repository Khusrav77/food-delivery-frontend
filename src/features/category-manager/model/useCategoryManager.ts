import { ref } from 'vue'
import { useCategoryStore } from '@/entities/category'
import { useProductStore } from '@/entities/dish'

export function useCategoryManager() {
  const categoryStore = useCategoryStore()
  const productStore = useProductStore()

  const newName = ref('')
  const editingId = ref<string | null>(null)
  const editingName = ref('')

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
    newName,
    editingId,
    editingName,
    startEdit,
    confirmEdit,
    addCategory,
    remove,
  }
}