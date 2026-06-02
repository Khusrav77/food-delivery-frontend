<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { Heart } from 'lucide-vue-next'
import { useProductStore } from '@/entities/dish'
import { useFavoriteStore } from '@/features/favorite-toggle'
import { DishCardA } from '@/widgets/dish-card'
import { DishPreviewModal } from '@/widgets/dish-preview'
import type { Product } from '@/entities/dish'

const router = useRouter()
const productStore = useProductStore()
const favoriteStore = useFavoriteStore()

const { products, loading } = storeToRefs(productStore)
const { ids } = storeToRefs(favoriteStore)

const selectedProduct = ref<Product | null>(null)

const favoriteProducts = computed(() =>
  products.value.filter((p) => ids.value.has(p.id)),
)

onMounted(() => {
  if (products.value.length === 0) productStore.fetchAll()
})
</script>

<template>
  <main class="max-w-6xl mx-auto px-4 md:px-6 pt-6 pb-24">
    <div class="flex items-center gap-3 mb-6">
      <Heart :size="24" class="text-red-500 fill-red-500 shrink-0" />
      <h1 class="font-display text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
        Избранное
      </h1>
      <span
        v-if="ids.size > 0"
        class="ml-1 px-2 py-0.5 rounded-full bg-accent-soft text-accent text-sm font-semibold"
      >
        {{ ids.size }}
      </span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="i in 6"
        :key="i"
        class="bg-surface rounded-3xl border border-line overflow-hidden animate-pulse"
      >
        <div class="px-3 pt-3">
          <div class="aspect-[4/3] bg-surface-soft rounded-2xl" />
        </div>
        <div class="p-4 space-y-3">
          <div class="h-4 bg-line rounded-lg w-3/4" />
          <div class="h-3 bg-line rounded-lg w-full" />
          <div class="flex justify-between mt-4">
            <div class="h-6 bg-line rounded-lg w-20" />
            <div class="h-9 bg-line-strong rounded-xl w-28" />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div
      v-else-if="favoriteProducts.length === 0"
      class="flex flex-col items-center gap-4 py-24 text-center"
    >
      <div class="w-16 h-16 rounded-2xl bg-canvas border border-line flex items-center justify-center">
        <Heart :size="28" class="text-faint" />
      </div>
      <div>
        <p class="text-ink font-semibold">Пока ничего не сохранено</p>
        <p class="text-muted text-sm mt-1">Нажмите ♥ на блюде, чтобы добавить в избранное</p>
      </div>
      <button
        class="mt-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-semibold
               transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        @click="router.push('/')"
      >
        Перейти в меню
      </button>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <DishCardA
        v-for="product in favoriteProducts"
        :key="product.id"
        :product="product"
        @select="selectedProduct = $event"
      />
    </div>

    <!-- Preview modal -->
    <DishPreviewModal
      v-if="selectedProduct"
      :product="selectedProduct"
      @close="selectedProduct = null"
    />
  </main>
</template>
