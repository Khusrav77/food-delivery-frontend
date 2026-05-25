<script setup lang="ts">
import { ShoppingCart } from 'lucide-vue-next'
import type { Product } from '../model/types'
import { getFirstImage, getMinPrice, hasMultiplePrices, formatPrice } from '../model/dishDisplay'

defineProps<{ product: Product }>()
</script>

<template>
  <article class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group">

    <!-- Image -->
    <div class="aspect-[4/3] bg-slate-100 overflow-hidden shrink-0">
      <img
        v-if="getFirstImage(product)"
        :src="getFirstImage(product)!"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center">
        <span class="text-6xl select-none">🍽️</span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col flex-1 gap-2">
      <h3 class="font-semibold text-slate-900 line-clamp-2 leading-snug text-base">
        {{ product.name }}
      </h3>

      <p v-if="product.description" class="text-slate-400 text-sm line-clamp-2 leading-relaxed flex-1">
        {{ product.description }}
      </p>
      <div v-else class="flex-1" />

      <!-- Price + CTA -->
      <div class="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
        <span class="text-orange-500 font-bold text-lg leading-none">
          <span v-if="hasMultiplePrices(product)" class="text-sm font-normal text-slate-400 mr-1">от</span>
          {{ formatPrice(getMinPrice(product)) }}
        </span>
        <button
          class="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-orange-500 border border-orange-300 rounded-lg hover:bg-orange-50 hover:border-orange-400 transition-colors"
          aria-label="Добавить в корзину"
        >
          <ShoppingCart :size="14" />
          В корзину
        </button>
      </div>
    </div>

  </article>
</template>
