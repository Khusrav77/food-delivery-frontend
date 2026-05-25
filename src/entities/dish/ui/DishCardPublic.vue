<script setup lang="ts">
import { ShoppingCart } from 'lucide-vue-next'
import type { Product } from '../model/types'
import { getFirstImage, getMinPrice, hasMultiplePrices, formatPrice, getActiveItems } from '../model/dishDisplay'

const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ select: [product: Product] }>()
</script>

<template>
  <article
    class="group cursor-pointer bg-surface rounded-2xl border border-line overflow-hidden flex flex-col
           hover:border-line-strong hover:shadow-[0_12px_32px_-12px_rgba(24,24,27,0.18)] transition-all duration-300 hover:-translate-y-0.5"
    @click="emit('select', props.product)"
  >

    <!-- Image -->
    <div class="relative aspect-[4/3] overflow-hidden shrink-0 bg-surface-soft">
      <img
        v-if="getFirstImage(product)"
        :src="getFirstImage(product)!"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <span class="text-6xl select-none opacity-30">🍽️</span>
      </div>

      <!-- Variant count badge -->
      <div v-if="getActiveItems(product).length > 1" class="absolute bottom-2.5 left-2.5">
        <span class="bg-accent/85 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-lg">
          {{ getActiveItems(product).length }} варианта
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col flex-1 gap-2">
      <h3 class="font-medium text-ink line-clamp-2 leading-snug text-[15px]">
        {{ product.name }}
      </h3>

      <p v-if="product.description" class="text-muted text-sm line-clamp-2 leading-relaxed flex-1">
        {{ product.description }}
      </p>
      <div v-else class="flex-1" />

      <!-- Price + CTA -->
      <div class="flex items-center justify-between mt-2 pt-3 border-t border-line">
        <div>
          <p v-if="hasMultiplePrices(product)" class="text-xs text-faint leading-none mb-1">от</p>
          <span class="font-display text-ink font-semibold text-xl leading-none">
            {{ formatPrice(getMinPrice(product)) }}
          </span>
        </div>
        <button
          class="flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-white
                 bg-accent hover:bg-accent-hover active:bg-orange-600
                 rounded-lg transition-colors"
          aria-label="Добавить в корзину"
          @click.stop
        >
          <ShoppingCart :size="14" />
          В корзину
        </button>
      </div>
    </div>

  </article>
</template>
