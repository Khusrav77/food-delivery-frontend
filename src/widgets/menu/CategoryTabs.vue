<script setup lang="ts">
import { computed } from 'vue'
import { useProductStore } from '@/entities/dish'
import { useCategoryStore } from '@/entities/category'

const props = defineProps<{ modelValue: string | 'all' | 'none' }>()
const emit = defineEmits<{ 'update:modelValue': [id: string | 'all' | 'none'] }>()

const productStore = useProductStore()
const categoryStore = useCategoryStore()

const categoryCount = computed(() => {
  const map: Record<string, number> = {}
  for (const p of productStore.products) {
    const key = p.categoryId ?? '__none__'
    map[key] = (map[key] ?? 0) + 1
  }
  return map
})
</script>

<template>
  <div class="flex gap-1 flex-wrap">
    <button
      :class="[
        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
        modelValue === 'all' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-100',
      ]"
      @click="emit('update:modelValue', 'all')"
    >
      Все <span class="ml-1 text-xs opacity-75">({{ productStore.products.length }})</span>
    </button>
    <button
      v-for="cat in categoryStore.categories"
      :key="cat.id"
      :class="[
        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
        modelValue === cat.id ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-100',
      ]"
      @click="emit('update:modelValue', cat.id)"
    >
      {{ cat.name }}
      <span class="ml-1 text-xs opacity-75">({{ categoryCount[cat.id] ?? 0 }})</span>
    </button>
    <button
      :class="[
        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
        modelValue === 'none' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-100',
      ]"
      @click="emit('update:modelValue', 'none')"
    >
      Без категории
      <span class="ml-1 text-xs opacity-75">({{ categoryCount['__none__'] ?? 0 }})</span>
    </button>
  </div>
</template>