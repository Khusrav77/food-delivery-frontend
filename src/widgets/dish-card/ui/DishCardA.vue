<script setup lang="ts">
import { ShoppingCart, UtensilsCrossed } from 'lucide-vue-next'
import { type Product, getActiveItems, formatItemLabel } from '@/entities/dish'
import { useCartStore } from '@/entities/cart'
import { FavoriteButton } from '@/features/favorite-toggle'
import { useDishCard } from '../model/useDishCard'
import CardTagList from './CardTagList.vue'

const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ select: [product: Product] }>()

const { gallery, sizeParts, tags, isMulti, variantCount, priceLabel, showFrom } = useDishCard(props.product)

const cart = useCartStore()

function addToCart(e: MouseEvent): void {
  e.stopPropagation()
  const activeItems = getActiveItems(props.product)
  if (isMulti.value || activeItems.length === 0) {
    emit('select', props.product)
    return
  }
  const item = activeItems[0]
  cart.addItem({
    menuItemId: item.id,
    productId: props.product.id,
    productName: props.product.name,
    variantName: formatItemLabel(item),
    price: item.price,
    image: item.images[0]?.url ?? null,
  })
}
</script>

<template>
  <article
    class="group cursor-pointer bg-surface rounded-3xl border border-line overflow-hidden flex flex-col
           hover:border-accent/30 hover:shadow-[0_16px_40px_-12px_rgba(251,146,60,0.25)]
           transition-all duration-300 hover:-translate-y-1"
    @click="emit('select', props.product)"
  >
    <!-- Gallery — inset with own rounded corners to create a frame effect -->
    <div class="px-3 pt-3">
      <div
        class="relative aspect-[4/3] overflow-hidden shrink-0 bg-surface-soft rounded-2xl"
        @mousemove="gallery.onHoverMove"
        @mouseleave="gallery.reset"
      >
        <img
          v-if="gallery.current"
          :src="gallery.current"
          :alt="product.name"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div v-else class="w-full h-full grid place-items-center">
          <UtensilsCrossed :size="52" class="text-faint opacity-30" />
        </div>

        <!-- Tags — multiple supported via flex-wrap -->
        <div v-if="tags.length" class="absolute top-2.5 left-2.5 max-w-[72%]">
          <CardTagList :tags="tags" variant="overlay" />
        </div>

        <!-- Favorite -->
        <div class="absolute top-2.5 right-2.5">
          <FavoriteButton :product-id="product.id" />
        </div>

        <!-- Gallery dots -->
        <div v-if="gallery.hasGallery" class="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
          <span
            v-for="(_, i) in gallery.count"
            :key="i"
            class="h-1.5 rounded-full transition-all duration-200"
            :class="i === gallery.index ? 'w-5 bg-white' : 'w-1.5 bg-white/55'"
          />
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col flex-1 gap-2.5">
      <h3 class="font-medium text-ink line-clamp-2 leading-snug text-[15px]">{{ product.name }}</h3>

      <!-- Size chips -->
      <div v-if="sizeParts.length || isMulti" class="flex flex-wrap items-center gap-1.5">
        <span
          v-for="part in sizeParts"
          :key="part"
          class="inline-flex items-center rounded-md bg-surface-soft text-muted text-xs font-medium px-2 py-1 leading-none"
        >
          {{ part }}
        </span>
        <span
          v-if="isMulti"
          class="inline-flex items-center rounded-md bg-accent/10 text-accent text-xs font-semibold px-2 py-1 leading-none"
        >
          {{ variantCount }} варианта
        </span>
      </div>

      <p v-if="product.description" class="text-muted text-sm line-clamp-2 leading-relaxed flex-1">
        {{ product.description }}
      </p>
      <div v-else class="flex-1" />

      <!-- Price + CTA (no divider) -->
      <div class="flex items-center justify-between mt-1">
        <div>
          <p v-if="showFrom" class="text-xs text-faint leading-none mb-1">от</p>
          <span class="font-display text-ink font-semibold text-xl leading-none">{{ priceLabel }}</span>
        </div>
        <button
          type="button"
          class="flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-white
                 bg-accent hover:bg-accent-hover active:bg-orange-600 rounded-xl transition-colors
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          :aria-label="isMulti ? 'Выбрать вариант' : 'Добавить в корзину'"
          @click="addToCart"
        >
          <ShoppingCart :size="14" />
          В корзину
        </button>
      </div>
    </div>
  </article>
</template>
