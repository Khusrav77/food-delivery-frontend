<script setup lang="ts">
import { useCategoryStrip } from '../model/useCategoryStrip'

const props = defineProps<{ modelValue: string | null }>()
const emit = defineEmits<{ 'update:modelValue': [id: string | null] }>()

const { categories, loading, error } = useCategoryStrip()

function selectCategory(id: string) {
  emit('update:modelValue', props.modelValue === id ? null : id)
}
</script>

<template>
  <section v-if="!error && (loading || categories.length > 0)" class="space-y-5">
    <div class="flex items-center gap-4">
      <h2 class="text-xl md:text-2xl font-bold text-slate-900 uppercase tracking-wide shrink-0">
        Доставка еды
      </h2>
      <div class="flex-1 h-px bg-slate-100" />
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="flex gap-3 overflow-hidden">
      <div
        v-for="n in 7"
        :key="n"
        class="shrink-0 h-10 rounded-full bg-slate-100 animate-pulse"
        :style="{ width: `${70 + n * 12}px` }"
      />
    </div>

    <!-- Category pills -->
    <div v-else class="flex gap-3 overflow-x-auto pb-1" style="scrollbar-width: none;">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="shrink-0 px-5 py-2 rounded-full text-sm font-medium border transition-all"
        :class="modelValue === cat.id
          ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
          : 'bg-white text-slate-700 border-slate-200 hover:border-orange-400 hover:text-orange-500'"
        @click="selectCategory(cat.id)"
      >
        {{ cat.name }}
      </button>
    </div>
  </section>
</template>
