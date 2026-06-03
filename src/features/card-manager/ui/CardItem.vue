<script setup lang="ts">
import { Star, Trash2 } from 'lucide-vue-next'
import type { ICard } from '@/entities/card'
import { BRAND_NAMES } from '@/entities/card'

defineProps<{ card: ICard }>()
const emit = defineEmits<{
  remove: [id: string]
  setPrimary: [id: string]
}>()

const BRAND_COLORS: Record<string, string> = {
  visa: 'bg-blue-50 text-blue-600',
  mastercard: 'bg-orange-50 text-orange-600',
  mir: 'bg-emerald-50 text-emerald-600',
  unknown: 'bg-surface-soft text-muted',
}
</script>

<template>
  <div
    class="relative bg-surface rounded-2xl border p-4 transition-colors"
    :class="card.isPrimary ? 'border-accent/40' : 'border-line'"
  >
    <!-- Primary badge -->
    <span
      v-if="card.isPrimary"
      class="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-accent-soft text-accent"
    >
      <Star :size="10" class="fill-accent" />
      Основная
    </span>

    <div class="flex items-center gap-3 pr-20">
      <div
        class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold"
        :class="BRAND_COLORS[card.brand] ?? BRAND_COLORS.unknown"
      >
        {{ BRAND_NAMES[card.brand].slice(0, 2).toUpperCase() }}
      </div>
      <div class="min-w-0">
        <p class="text-sm font-semibold text-ink">{{ BRAND_NAMES[card.brand] }} •••• {{ card.last4 }}</p>
        <p class="text-xs text-muted mt-0.5">{{ card.expMonth }}/{{ card.expYear }} · {{ card.holder }}</p>
      </div>
    </div>

    <div class="flex items-center gap-2 mt-3 pt-3 border-t border-line">
      <button
        v-if="!card.isPrimary"
        class="text-xs text-muted hover:text-accent transition-colors
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded"
        @click="emit('setPrimary', card.id)"
      >
        Сделать основной
      </button>
      <div class="flex items-center gap-1 ml-auto">
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center text-faint hover:text-red-500 hover:bg-red-50
                 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/40"
          title="Удалить"
          @click="emit('remove', card.id)"
        >
          <Trash2 :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>
