import { ref, computed, watch, type Ref } from 'vue'
import { type Product, type MenuItem, getActiveItems } from '@/entities/dish'
import { formatPrice } from '@/shared/lib/money'

export function useDishPreview(productRef: Ref<Product | null>) {
  const selectedItem = ref<MenuItem | null>(null)

  watch(productRef, (p) => {
    selectedItem.value = p ? (getActiveItems(p)[0] ?? null) : null
  }, { immediate: true })

  const activeItems = computed(() =>
    productRef.value ? getActiveItems(productRef.value) : [],
  )

  const displayPrice = computed(() =>
    selectedItem.value ? formatPrice(selectedItem.value.price) : '',
  )

  const displayImage = computed(() =>
    selectedItem.value?.images[0]?.url ?? null,
  )

  function selectItem(item: MenuItem): void {
    selectedItem.value = item
  }

  return { selectedItem, activeItems, displayPrice, displayImage, selectItem }
}
