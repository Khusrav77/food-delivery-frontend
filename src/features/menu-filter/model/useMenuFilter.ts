import { ref, computed } from 'vue'
import { useProductStore } from '@/entities/dish'
import { useTagStore } from '@/entities/tag'
import { useCategoryStore } from '@/entities/category'

export function useMenuFilter() {
  const productStore = useProductStore()
  const tagStore = useTagStore()
  const categoryStore = useCategoryStore()

  const search = ref('')
  const activeCategoryId = ref<string | 'all' | 'none'>('all')
  const activeTagIds = ref<string[]>([])

  const categoryCount = computed(() => {
    const map: Record<string, number> = {}
    for (const p of productStore.products) {
      const key = p.categoryId ?? '__none__'
      map[key] = (map[key] ?? 0) + 1
    }
    return map
  })

  const filteredProducts = computed(() => {
    let list = productStore.products

    if (activeCategoryId.value === 'none') {
      list = list.filter(p => p.categoryId === null)
    } else if (activeCategoryId.value !== 'all') {
      list = list.filter(p => p.categoryId === activeCategoryId.value)
    }

    if (activeTagIds.value.length > 0) {
      // продукт попадает если хотя бы один его menu_item имеет все выбранные теги
      list = list.filter(p =>
        activeTagIds.value.every(tid => p.menuItems.some(mi => mi.tagIds.includes(tid))),
      )
    }

    if (search.value.trim()) {
      const q = search.value.trim().toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      )
    }

    return list
  })

  function toggleTagFilter(id: string) {
    const idx = activeTagIds.value.indexOf(id)
    if (idx === -1) activeTagIds.value.push(id)
    else activeTagIds.value.splice(idx, 1)
  }

  return {
    productStore,
    tagStore,
    categoryStore,
    search,
    activeCategoryId,
    activeTagIds,
    categoryCount,
    filteredProducts,
    toggleTagFilter,
  }
}