<script setup lang="ts">
import { type Product, DishCardPublic } from '@/entities/dish'

defineProps<{
  products: Product[]
  loading: boolean
}>()
</script>

<template>
  <section class="space-y-5">

    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="n in 6" :key="n" class="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
        <div class="aspect-[4/3] bg-slate-100" />
        <div class="p-4 space-y-3">
          <div class="h-4 bg-slate-100 rounded-lg w-3/4" />
          <div class="h-3 bg-slate-100 rounded-lg w-full" />
          <div class="h-3 bg-slate-100 rounded-lg w-2/3" />
          <div class="flex justify-between mt-4">
            <div class="h-6 bg-slate-100 rounded-lg w-20" />
            <div class="h-8 bg-slate-100 rounded-lg w-24" />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="products.length === 0" class="py-16 text-center bg-white rounded-2xl border border-slate-100">
      <div class="text-5xl mb-3 select-none">🍽️</div>
      <p class="text-slate-500 text-base">Нет блюд в этой категории</p>
    </div>

    <!-- Products grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <DishCardPublic
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>

  </section>
</template>
