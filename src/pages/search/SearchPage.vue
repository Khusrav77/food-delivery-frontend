<script setup lang="ts">
import { Search, X, UtensilsCrossed } from 'lucide-vue-next'
import { DishCardA } from '@/widgets/dish-card'
import { DishPreviewModal } from '@/widgets/dish-preview'
import { useSearchPage } from './model/useSearchPage'

const page = useSearchPage()
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 md:px-6 pt-4 pb-16">
    <!-- Toolbar: search + filters + close (column on mobile, row on tablet+) -->
    <div class="flex flex-col md:flex-row items-stretch md:items-center gap-2">
      <div class="relative md:flex-1 md:min-w-0">
        <Search :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
        <input
          v-model="page.query"
          type="search"
          autofocus
          placeholder="Найдите бургер, пиццу, суп…"
          class="w-full h-11 md:h-12 pl-11 pr-11 rounded-xl bg-surface border border-line-strong
                 text-ink text-base font-medium placeholder:text-faint placeholder:font-normal
                 focus:outline-none focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/20 transition-all"
        />
        <button
          v-if="page.query"
          class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface-soft
                 flex items-center justify-center text-muted hover:text-ink transition-colors
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          aria-label="Очистить запрос"
          @click="page.query = ''"
        >
          <X :size="14" />
        </button>
      </div>

      <select
        v-model="page.selectedCategoryId"
        class="shrink-0 h-11 md:h-12 px-3 rounded-xl bg-surface border border-line-strong text-sm font-medium text-ink
               focus:outline-none focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/20 transition-all"
      >
        <option :value="null">Все категории</option>
        <option v-for="cat in page.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>

      <select
        v-model="page.selectedTagId"
        class="shrink-0 h-11 md:h-12 px-3 rounded-xl bg-surface border border-line-strong text-sm font-medium text-ink
               focus:outline-none focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/20 transition-all"
      >
        <option :value="null">Все теги</option>
        <option v-for="tag in page.tags" :key="tag.id" :value="tag.id">{{ tag.label }}</option>
      </select>

      <button
        v-if="page.hasFilters"
        class="shrink-0 h-11 md:h-12 px-3 rounded-xl border border-accent/40 text-sm font-medium text-accent
               flex items-center gap-1.5 justify-center hover:bg-accent/5 transition-colors
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        @click="page.clearFilters"
      >
        <X :size="14" />
        Сбросить
      </button>

      <button
        class="shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-xl bg-surface border border-line-strong
               flex items-center justify-center text-muted hover:text-ink hover:bg-surface-soft transition-colors
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        aria-label="Закрыть поиск"
        @click="page.close"
      >
        <X :size="18" />
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="page.loading" class="mt-8 grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div v-for="i in 8" :key="i" class="bg-surface rounded-3xl border border-line overflow-hidden">
        <div class="px-2.5 pt-2.5">
          <div class="aspect-[4/3] rounded-2xl bg-surface animate-pulse" />
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
      v-else-if="page.results.length === 0 && page.query.trim() !== ''"
      class="mt-16 flex flex-col items-center gap-4 text-center"
    >
      <div class="w-16 h-16 rounded-2xl bg-surface-soft border border-line flex items-center justify-center">
        <UtensilsCrossed :size="28" class="text-faint" />
      </div>
      <div>
        <p class="text-base font-semibold text-ink">Ничего не нашли по запросу «{{ page.query.trim() }}»</p>
        <p class="text-sm text-muted mt-1">Попробуйте изменить запрос или сбросить фильтры</p>
      </div>
      <button
        v-if="page.hasFilters"
        class="mt-1 px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold
               hover:bg-accent-hover transition-colors
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        @click="page.clearFilters"
      >
        Сбросить фильтры
      </button>
    </div>

    <!-- Idle state -->
    <div
      v-else-if="page.results.length === 0 && page.query.trim() === '' && !page.hasFilters"
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
        Найдено: <span class="font-semibold text-ink">{{ page.results.length }}</span>
      </p>
      <div class="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <DishCardA
          v-for="product in page.results"
          :key="product.id"
          :product="product"
          @select="page.openPreview"
        />
      </div>
    </div>
  </main>

  <DishPreviewModal
    :product="page.selectedProduct"
    :show="page.selectedProduct !== null"
    @close="page.closePreview"
  />
</template>
