<script setup lang="ts">
import { toRef } from 'vue'
import { useProductStore, type Product } from '@/entities/dish'
import { useReorderProducts } from '@/features/reorder-products'
import { DishCardAdmin } from '@/widgets/dish-card'

const props = defineProps<{ products: Product[]; sortable: boolean }>()
const emit = defineEmits<{ edit: [product: Product] }>()

const productStore = useProductStore()
const { items, moveUp, moveDown } = useReorderProducts(toRef(props, 'products'))
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <DishCardAdmin
      v-for="(product, index) in items"
      :key="product.id"
      :product="product"
      :sortable="sortable"
      :can-move-up="sortable && index > 0"
      :can-move-down="sortable && index < items.length - 1"
      @edit="emit('edit', $event)"
      @remove="productStore.removeProduct($event)"
      @toggle-active="productStore.toggleActive($event)"
      @move-up="moveUp(product.id)"
      @move-down="moveDown(product.id)"
    />
  </div>
</template>
