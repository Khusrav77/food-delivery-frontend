<script setup lang="ts">
import { toRef } from 'vue'
import { useProductStore, type Product } from '@/entities/dish'
import { useReorderProducts } from '@/features/reorder-products'
import { Sortable } from '@/shared/ui/Sortable'
import { DishCardAdmin } from '@/widgets/dish-card'

const props = defineProps<{ products: Product[]; sortable: boolean }>()
const emit = defineEmits<{ edit: [product: Product] }>()

const productStore = useProductStore()
const { items, persist } = useReorderProducts(toRef(props, 'products'))
</script>

<template>
  <Sortable
    v-model="items"
    handle=".dish-drag-handle"
    :disabled="!sortable"
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    @end="persist"
  >
    <template #item="{ element: product }">
      <DishCardAdmin
        :product="product"
        :draggable-handle="sortable"
        @edit="emit('edit', $event)"
        @remove="productStore.removeProduct($event)"
        @toggle-active="productStore.toggleActive($event)"
      />
    </template>
  </Sortable>
</template>
