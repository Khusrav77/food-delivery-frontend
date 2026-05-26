import { ref, watch, type Ref } from 'vue'
import { useProductStore, type Product } from '@/entities/dish'

/**
 * Keeps a local, drag-mutable copy of one category's products and persists the
 * new order on drop. `source` is the reactive list to mirror (e.g. filtered by
 * category); when the store re-sorts after a save, the copy resyncs automatically.
 */
export function useReorderProducts(source: Ref<Product[]>) {
  const productStore = useProductStore()
  const items = ref<Product[]>([...source.value])

  watch(source, next => {
    items.value = [...next]
  })

  async function persist() {
    try {
      await productStore.reorderProducts(items.value.map(p => p.id))
    } catch {
      // Store rolled back on failure; the watch above resyncs the local list.
    }
  }

  return { items, persist }
}
