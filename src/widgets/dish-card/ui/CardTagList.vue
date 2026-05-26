<script setup lang="ts">
import type { CardTag } from '../model/useDishCard'

defineProps<{ tags: CardTag[]; variant?: 'soft' | 'overlay' }>()

const SOFT: Record<string, string> = {
  red: 'bg-red-100 text-red-700',
  orange: 'bg-orange-100 text-orange-700',
  green: 'bg-green-100 text-green-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  blue: 'bg-blue-100 text-blue-700',
  violet: 'bg-violet-100 text-violet-700',
  yellow: 'bg-yellow-100 text-yellow-700',
}

const OVERLAY: Record<string, string> = {
  red: 'bg-red-500/95 text-white',
  orange: 'bg-accent/95 text-white',
  green: 'bg-green-500/95 text-white',
  emerald: 'bg-emerald-500/95 text-white',
  blue: 'bg-blue-500/95 text-white',
  violet: 'bg-violet-500/95 text-white',
  yellow: 'bg-yellow-400/95 text-yellow-950',
}
</script>

<template>
  <div class="flex flex-wrap gap-1.5">
    <span
      v-for="tag in tags"
      :key="tag.id"
      class="inline-flex items-center gap-1 rounded-full font-semibold px-2.5 py-1 text-xs leading-none"
      :class="[
        (variant === 'overlay' ? OVERLAY : SOFT)[tag.color] ?? 'bg-slate-100 text-slate-700',
        variant === 'overlay' ? 'backdrop-blur-sm shadow-sm' : '',
      ]"
    >
      <span v-if="tag.emoji" class="text-[13px] leading-none">{{ tag.emoji }}</span>
      {{ tag.label }}
    </span>
  </div>
</template>
