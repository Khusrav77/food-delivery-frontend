<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, SlidersHorizontal, X, UtensilsCrossed } from 'lucide-vue-next'
import { useProductStore, type Product } from '@/entities/dish'
import { useCategoryStore } from '@/entities/category'
import { useTagStore } from '@/entities/tag'
import { DishCardA } from '@/widgets/dish-card'
import { DishPreviewModal } from '@/widgets/dish-preview'
import { useSearch } from '@/features/dish-search'

const route = useRoute()
const router = useRouter()

const productStore = useProductStore()
const categoryStore = useCategoryStore()
const tagStore = useTagStore()

const {
  query,
  minPrice,
  maxPrice,
  selectedCategoryId,
  selectedTagId,
  results,
  hasFilters,
  clearFilters,
} = useSearch()

const filtersOpen = ref(false)
const selectedProduct = ref<Product | null>(null)

function openPreview(product: Product): void {
  selectedProduct.value = product
}
function closePreview(): void {
  selectedProduct.value = null
}

watch(query, (q) => {
  router.replace({ query: { q: q || undefined } })
})

onMounted(async () => {
  query.value = typeof route.query.q === 'string' ? route.query.q : ''
  const tasks: Promise<void>[] = [categoryStore.fetchAll(), tagStore.fetchAll()]
  if (productStore.products.length === 0) tasks.push(productStore.fetchAll())
  await Promise.all(tasks)
})
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-16">
    <!-- Search field -->
    <div class="relative">
      <Search :size="20" class="absolute left-4 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
      <input
        v-model="query"
        type="search"
        autofocus
        placeholder="Найдите бургер, пиццу, суп…"
        class="w-full h-14 md:h-16 pl-12 pr-12 rounded-2xl bg-surface border border-line-strong
               text-ink text-lg font-medium placeholder:text-faint placeholder:font-normal
               focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition-all"
      />
      <button
        v-if="query"
        class="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-surface-soft
               flex items-center justify-center text-muted hover:text-ink transition-colors
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        aria-label="Очистить запрос"
        @click="query = ''"
      >
        <X :size="15" />
      </button>
    </div>

    <!-- Filters toggle (mobile) -->
    <div class="mt-4 flex items-center justify-between md:hidden">
      <button
        class="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-line-strong text-sm font-medium
               text-ink hover:bg-surface-soft transition-colors
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        @click="filtersOpen = !filtersOpen"
      >
        <SlidersHorizontal :size="15" />
        Фильтры
        <span v-if="hasFilters" class="w-2 h-2 rounded-full bg-accent" />
      </button>
      <button
        v-if="hasFilters"
        class="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
        @click="clearFilters"
      >
        Сбросить
      </button>
    </div>

    <!-- Filters -->
    <div
      class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      :class="filtersOpen ? 'grid' : 'hidden md:grid'"
    >
      <!-- Category -->
      <label class="flex flex-col gap-1.5">
        <span class="text-xs font-medium text-faint">Категория</span>
        <select
          v-model="selectedCategoryId"
          class="h-11 px-3 rounded-xl bg-surface border border-line-strong text-sm font-medium text-ink
                 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition-all"
        >
          <option :value="null">Все категории</option>
          <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </label>

      <!-- Tag -->
      <label class="flex flex-col gap-1.5">
        <span class="text-xs font-medium text-faint">Тег</span>
        <select
          v-model="selectedTagId"
          class="h-11 px-3 rounded-xl bg-surface border border-line-strong text-sm font-medium text-ink
                 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition-all"
        >
          <option :value="null">Все теги</option>
          <option v-for="tag in tagStore.tags" :key="tag.id" :value="tag.id">
            {{ tag.label }}
          </option>
        </select>
      </label>

      <!-- Min price -->
      <label class="flex flex-col gap-1.5">
        <span class="text-xs font-medium text-faint">Цена от, ₽</span>
        <input
          v-model.number="minPrice"
          type="number"
          min="0"
          placeholder="0"
          class="h-11 px-3 rounded-xl bg-surface border border-line-strong text-sm font-medium text-ink
                 placeholder:text-faint placeholder:font-normal
                 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition-all"
        />
      </label>

      <!-- Max price -->
      <label class="flex flex-col gap-1.5">
        <span class="text-xs font-medium text-faint">Цена до, ₽</span>
        <input
          v-model.number="maxPrice"
          type="number"
          min="0"
          placeholder="∞"
          class="h-11 px-3 rounded-xl bg-surface border border-line-strong text-sm font-medium text-ink
                 placeholder:text-faint placeholder:font-normal
                 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition-all"
        />
      </label>
    </div>

    <!-- Reset (desktop) -->
    <div v-if="hasFilters" class="mt-3 hidden md:flex">
      <button
        class="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors
               focus-visible:outline-none"
        @click="clearFilters"
      >
        <X :size="14" />
        Сбросить фильтры
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="productStore.loading" class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="i in 6"
        :key="i"
        class="bg-surface rounded-3xl border border-line overflow-hidden"
      >
        <div class="px-3 pt-3">
          <div class="aspect-[4/3] rounded-2xl bg-surface-soft animate-pulse" />
        </div>
        <div class="p-4 space-y-3">
          <div class="h-4 bg-surface-soft rounded animate-pulse w-3/4" />
          <div class="h-3 bg-surface-soft rounded animate-pulse w-full" />
          <div class="h-7 bg-surface-soft rounded-xl animate-pulse w-1/2 mt-2" />
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="results.length === 0 && query.trim() !== ''"
      class="mt-16 flex flex-col items-center gap-4 text-center"
    >
      <div class="w-16 h-16 rounded-2xl bg-surface-soft border border-line flex items-center justify-center">
        <UtensilsCrossed :size="28" class="text-faint" />
      </div>
      <div>
        <p class="text-base font-semibold text-ink">Ничего не нашли по запросу «{{ query.trim() }}»</p>
        <p class="text-sm text-muted mt-1">Попробуйте изменить запрос или сбросить фильтры</p>
      </div>
      <button
        v-if="hasFilters"
        class="mt-1 px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold
               hover:bg-accent-hover transition-colors
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        @click="clearFilters"
      >
        Сбросить фильтры
      </button>
    </div>

    <!-- Idle state (no query, no filters) -->
    <div
      v-else-if="results.length === 0 && query.trim() === '' && !hasFilters"
      class="mt-16 flex flex-col items-center gap-3 text-center"
    >
      <div class="w-16 h-16 rounded-2xl bg-accent-soft border border-accent/20 flex items-center justify-center">
        <Search :size="28" class="text-accent" />
      </div>
      <p class="text-base font-semibold text-ink">Что хотите заказать?</p>
      <p class="text-sm text-muted">Начните вводить название блюда или выберите фильтры</p>
    </div>

    <!-- Results -->
    <div v-else class="mt-8">
      <p class="text-sm text-muted mb-4">
        Найдено: <span class="font-semibold text-ink">{{ results.length }}</span>
      </p>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DishCardA
          v-for="product in results"
          :key="product.id"
          :product="product"
          @select="openPreview"
        />
      </div>
    </div>
  </main>

  <DishPreviewModal
    :product="selectedProduct"
    :show="selectedProduct !== null"
    @close="closePreview"
  />
</template>
