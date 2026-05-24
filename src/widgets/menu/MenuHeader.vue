<script setup lang="ts">
import { Plus, Settings2, Tag as TagIcon } from 'lucide-vue-next'

defineProps<{ count: number }>()
defineEmits<{ create: []; categories: []; tags: [] }>()
</script>

<template>
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Меню</h1>
      <p class="text-slate-500 text-sm mt-0.5">{{ count }} блюд</p>
    </div>
    <div class="flex items-center gap-2">
      <button
        class="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
        @click="$emit('categories')"
      >
        <Settings2 :size="15" />
        Категории
      </button>
      <button
        class="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
        @click="$emit('tags')"
      >
        <TagIcon :size="15" />
        Теги
      </button>
      <button
        class="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
        @click="$emit('create')"
      >
        <Plus :size="16" />
        Добавить блюдо
      </button>
    </div>
  </div>
</template>