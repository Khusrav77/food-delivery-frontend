import { ref, watch, type Ref } from 'vue'
import { useProductStore, type Product } from '@/entities/dish'

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

  function moveUp(id: string) {
    const idx = items.value.findIndex(p => p.id === id)
    if (idx <= 0) return
    const copy = [...items.value]
    ;[copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]]
    items.value = copy
    persist()
  }

  function moveDown(id: string) {
    const idx = items.value.findIndex(p => p.id === id)
    if (idx < 0 || idx >= items.value.length - 1) return
    const copy = [...items.value]
    ;[copy[idx], copy[idx + 1]] = [copy[idx + 1], copy[idx]]
    items.value = copy
    persist()
  }

  return { items, moveUp, moveDown }
}
