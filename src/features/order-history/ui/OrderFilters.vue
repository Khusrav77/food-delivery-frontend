<script setup lang="ts">
import { ArrowUpDown } from 'lucide-vue-next'
import type { StatusFilter, SortDirection } from '../model/orderFilters'

defineProps<{
  statusFilter: StatusFilter
  sortDirection: SortDirection
}>()

const emit = defineEmits<{
  'update:statusFilter': [v: StatusFilter]
  'update:sortDirection': [v: SortDirection]
}>()

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'accepted', label: 'Принят' },
  { value: 'cooking', label: 'Готовится' },
  { value: 'on_the_way', label: 'В пути' },
  { value: 'delivered', label: 'Доставлен' },
]
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <div class="flex items-center gap-1 flex-wrap">
      <button
        v-for="opt in STATUS_OPTIONS"
        :key="opt.value"
        class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        :class="statusFilter === opt.value
          ? 'bg-accent text-white'
          : 'bg-surface border border-line text-muted hover:text-ink hover:border-ink/20'"
        @click="emit('update:statusFilter', opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>

    <button
      class="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-line
             text-muted hover:text-ink hover:border-ink/20 transition-colors
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      @click="emit('update:sortDirection', sortDirection === 'desc' ? 'asc' : 'desc')"
    >
      <ArrowUpDown :size="13" />
      {{ sortDirection === 'desc' ? 'Сначала новые' : 'Сначала старые' }}
    </button>
  </div>
</template>
