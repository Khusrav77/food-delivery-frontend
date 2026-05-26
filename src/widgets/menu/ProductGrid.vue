<script setup lang="ts">
import { useProductStore, type Product } from '@/entities/dish'
import { DishCardAdmin } from '@/widgets/dish-card'

defineProps<{ products: Product[] }>()
defineEmits<{ edit: [product: Product] }>()

const productStore = useProductStore()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <DishCardAdmin
      v-for="product in products"
      :key="product.id"
      :product="product"
      @edit="$emit('edit', $event)"
      @remove="productStore.removeProduct($event)"
      @toggle-active="productStore.toggleActive($event)"
    />
  </div>
</template>
