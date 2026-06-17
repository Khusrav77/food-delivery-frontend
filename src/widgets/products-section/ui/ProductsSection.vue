<script setup lang="ts">
import { UtensilsCrossed } from 'lucide-vue-next'
import { type Product } from '@/entities/dish'
import { DishCardA } from '@/widgets/dish-card'

defineProps<{
  sections: { id: string; name: string; products: Product[] }[]
  loading: boolean
}>()

const emit = defineEmits<{ select: [product: Product] }>()
</script>

<template>
  <!-- Loading skeleton -->
  <div v-if="loading" class="space-y-10 mt-8">
    <div v-for="n in 2" :key="n" class="space-y-4">
      <div class="h-7 bg-surface-soft rounded-lg w-40 animate-pulse" />
      <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        <div
          v-for="k in 4"
          :key="k"
          class="bg-surface rounded-3xl border border-line overflow-hidden animate-pulse"
        >
          <div class="px-2.5 pt-2.5">
            <div class="aspect-[4/3] bg-surface rounded-2xl" />
          </div>
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
    </div>
  </div>

  <!-- Empty state (loaded, no products at all) -->
  <div
    v-else-if="sections.length === 0"
    class="py-16 text-center bg-surface rounded-3xl border border-line mt-8"
  >
    <UtensilsCrossed :size="48" class="text-faint opacity-40 mx-auto mb-3" />
    <p class="text-muted text-base">Меню пока недоступно</p>
  </div>

  <!-- Category sections -->
  <div v-else class="space-y-12 mt-8">
    <section
      v-for="section in sections"
      :id="section.id"
      :key="section.id"
    >
      <h3 class="font-display text-2xl md:text-3xl font-extrabold text-ink tracking-tight mb-5">
        {{ section.name }}
      </h3>
      <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        <DishCardA
          v-for="product in section.products"
          :key="product.id"
          :product="product"
          @select="emit('select', $event)"
        />
      </div>
    </section>
  </div>
</template>
