import { computed, reactive, toRef } from 'vue'
import {
  type Product,
  getActiveItems,
  getPrimaryItem,
  getGalleryImages,
  getSizeParts,
  getProductTagIds,
  getMinPrice,
  hasMultiplePrices,
  formatPrice,
} from '@/entities/dish'
import { useTagStore, resolveTagStyle, type TagColor } from '@/entities/tag'
import { useImageGallery } from './useImageGallery'

export interface CardTag {
  id: string
  label: string
  color: TagColor
  emoji?: string
}

export function useDishCard(product: Product) {
  const tagStore = useTagStore()
  const ref_ = toRef(() => product)

  const images = computed(() => getGalleryImages(ref_.value, 4))
  // reactive() so template can read gallery.current / gallery.index without .value
  const gallery = reactive(useImageGallery(images))

  const primary = computed(() => getPrimaryItem(ref_.value))
  const sizeParts = computed(() => (primary.value ? getSizeParts(primary.value) : []))

  const tags = computed<CardTag[]>(() =>
    getProductTagIds(ref_.value)
      .map(id => tagStore.getById(id))
      .filter((t): t is NonNullable<typeof t> => t != null)
      .map(t => {
        const style = resolveTagStyle(t)
        return { id: t.id, label: t.label, color: style.color, emoji: style.emoji }
      }),
  )

  const variantCount = computed(() => getActiveItems(ref_.value).length)
  const isMulti = computed(() => variantCount.value > 1)
  const minPrice = computed(() => getMinPrice(ref_.value))
  const showFrom = computed(() => hasMultiplePrices(ref_.value))
  const priceLabel = computed(() => formatPrice(minPrice.value))

  return { gallery, images, primary, sizeParts, tags, variantCount, isMulti, priceLabel, showFrom }
}
