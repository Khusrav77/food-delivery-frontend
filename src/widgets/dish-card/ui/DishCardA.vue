<script setup lang="ts">
import { computed } from 'vue'
import { Plus, Minus, UtensilsCrossed } from 'lucide-vue-next'
import { type Product, getActiveItems, formatItemLabel } from '@/entities/dish'
import { useCartStore } from '@/entities/cart'
import { useToastStore } from '@/shared/lib/toast'
import { FavoriteButton } from '@/features/favorite-toggle'
import { useDishCard } from '../model/useDishCard'
import CardTagList from './CardTagList.vue'

const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ select: [product: Product] }>()

const { gallery, sizeParts, tags, isMulti, variantCount, priceLabel, showFrom } = useDishCard(props.product)

const cart = useCartStore()
const toast = useToastStore()

// For single-variant products we know the exact menuItemId to track in cart.
const primaryItemId = computed<string | null>(() => {
  if (isMulti.value) return null
  return getActiveItems(props.product)[0]?.id ?? null
})

const cartQty = computed<number>(() => {
  if (!primaryItemId.value) return 0
  return cart.items.find(i => i.menuItemId === primaryItemId.value)?.quantity ?? 0
})

const inCart = computed(() => cartQty.value > 0)

function handleAdd(e: MouseEvent): void {
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
  toast.success(`${props.product.name} добавлен в корзину`)
}

function increment(e: MouseEvent): void {
  e.stopPropagation()
  if (!primaryItemId.value) return
  cart.updateQuantity(primaryItemId.value, cartQty.value + 1)
}

function decrement(e: MouseEvent): void {
  e.stopPropagation()
  if (!primaryItemId.value) return
  if (cartQty.value <= 1) {
    cart.removeItem(primaryItemId.value)
  } else {
    cart.updateQuantity(primaryItemId.value, cartQty.value - 1)
  }
}
</script>

<template>
  <article
    class="group cursor-pointer bg-surface rounded-3xl border border-line overflow-hidden flex flex-col
           hover:border-accent/30 hover:shadow-[0_16px_40px_-12px_rgba(251,146,60,0.25)]
           transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1
           motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    @click="emit('select', props.product)"
  >
    <!-- Gallery -->
    <div class="px-2.5 pt-2.5">
      <div
        class="relative aspect-[4/3] overflow-hidden shrink-0 bg-surface-soft rounded-2xl"
        @mousemove="gallery.onHoverMove"
        @mouseleave="gallery.reset"
      >
        <img
          v-if="gallery.current"
          :src="gallery.current"
          :alt="product.name"
          loading="lazy"
          decoding="async"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105
                 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div v-else class="w-full h-full grid place-items-center">
          <UtensilsCrossed :size="48" class="text-faint opacity-30" />
        </div>

        <!-- Tags -->
        <div v-if="tags.length" class="absolute top-2 left-2 max-w-[75%]">
          <CardTagList :tags="tags" variant="overlay" />
        </div>

        <!-- Favorite -->
        <div class="absolute top-2 right-2">
          <FavoriteButton :product-id="product.id" />
        </div>

        <!-- Gallery dots -->
        <div v-if="gallery.hasGallery" class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
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
    <div class="p-3.5 flex flex-col flex-1 gap-2">
      <h3 class="font-semibold text-ink line-clamp-2 leading-snug text-[15px]">{{ product.name }}</h3>

      <!-- Size chips + variant count -->
      <div v-if="sizeParts.length || isMulti" class="flex flex-wrap items-center gap-1.5">
        <span
          v-for="part in sizeParts"
          :key="part"
          class="inline-flex items-center rounded-md bg-surface-soft text-muted text-xs font-medium px-2 py-0.5 leading-none"
        >
          {{ part }}
        </span>
        <span
          v-if="isMulti"
          class="inline-flex items-center rounded-md bg-accent/10 text-accent text-xs font-semibold px-2 py-0.5 leading-none"
        >
          {{ variantCount }} варианта
        </span>
      </div>

      <p v-if="product.description" class="text-muted text-[13px] line-clamp-2 leading-relaxed flex-1">
        {{ product.description }}
      </p>
      <div v-else class="flex-1" />

      <!-- Price + CTA -->
      <div class="flex items-end justify-between gap-2 mt-0.5">
        <!-- Price -->
        <div class="min-w-0">
          <p v-if="showFrom" class="text-[11px] text-faint leading-none mb-1">от</p>
          <span class="font-display text-ink font-extrabold text-xl leading-none">{{ priceLabel }}</span>
        </div>

        <!-- CTA: stepper when in cart (single variant), + button otherwise -->
        <div class="shrink-0">
          <!-- Quantity stepper -->
          <Transition name="stepper">
            <div
              v-if="inCart && !isMulti"
              key="stepper"
              class="flex items-center bg-accent rounded-full overflow-hidden h-11 motion-reduce:transition-none"
            >
              <button
                type="button"
                aria-label="Уменьшить количество"
                class="flex items-center justify-center w-10 h-full text-white hover:bg-white/15 active:bg-white/25
                       transition-colors duration-150 focus-visible:outline-none focus-visible:ring-inset
                       focus-visible:ring-2 focus-visible:ring-white/50"
                @click="decrement"
              >
                <Minus :size="16" />
              </button>
              <span class="min-w-[24px] text-center text-white text-sm font-bold select-none px-0.5">
                {{ cartQty }}
              </span>
              <button
                type="button"
                aria-label="Увеличить количество"
                class="flex items-center justify-center w-10 h-full text-white hover:bg-white/15 active:bg-white/25
                       transition-colors duration-150 focus-visible:outline-none focus-visible:ring-inset
                       focus-visible:ring-2 focus-visible:ring-white/50"
                @click="increment"
              >
                <Plus :size="16" />
              </button>
            </div>

            <!-- Add button -->
            <button
              v-else
              key="add"
              type="button"
              class="grid place-items-center w-11 h-11 rounded-full bg-accent hover:bg-accent-hover
                     text-white transition-[background-color,transform] duration-200 active:scale-90
                     motion-reduce:transition-none motion-reduce:active:scale-100
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              :aria-label="isMulti ? 'Выбрать вариант' : 'Добавить в корзину'"
              @click="handleAdd"
            >
              <Plus :size="20" />
            </button>
          </Transition>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.stepper-enter-active,
.stepper-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.stepper-enter-from,
.stepper-leave-to {
  opacity: 0;
  transform: scale(0.85);
}
@media (prefers-reduced-motion: reduce) {
  .stepper-enter-active,
  .stepper-leave-active {
    transition: none;
  }
}
</style>
