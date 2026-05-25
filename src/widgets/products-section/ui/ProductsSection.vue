<script setup lang="ts">
import { UtensilsCrossed } from 'lucide-vue-next'
import { type Product, DishCardPublic } from '@/entities/dish'

defineProps<{
  products: Product[]
  loading: boolean
}>()

const emit = defineEmits<{ select: [product: Product] }>()
</script>

<template>
  <section class="space-y-5">

    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="n in 6" :key="n" class="bg-surface rounded-2xl border border-line overflow-hidden animate-pulse">
        <div class="aspect-[4/3] bg-surface-soft" />
        <div class="p-4 space-y-3">
          <div class="h-4 bg-line rounded-lg w-3/4" />
          <div class="h-3 bg-line rounded-lg w-full" />
          <div class="h-3 bg-line rounded-lg w-2/3" />
          <div class="flex justify-between mt-4">
            <div class="h-6 bg-line rounded-lg w-20" />
            <div class="h-9 bg-line-strong rounded-xl w-28" />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="products.length === 0" class="py-16 text-center bg-surface rounded-2xl border border-line">
      <UtensilsCrossed :size="48" class="text-faint opacity-40 mx-auto mb-3" />
      <p class="text-muted text-base">Нет блюд в этой категории</p>
    </div>

    <!-- Products grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <DishCardPublic
        v-for="product in products"
        :key="product.id"
        :product="product"
        @select="emit('select', $event)"
      />
    </div>

  </section>
</template>
