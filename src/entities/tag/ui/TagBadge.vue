<script setup lang="ts">
import type { Tag } from '../model/types'

const props = defineProps<{ tag: Tag; small?: boolean }>()

const colorMap: Record<string, string> = {
  red: 'bg-red-100 text-red-700',
  orange: 'bg-orange-100 text-orange-700',
  green: 'bg-green-100 text-green-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  blue: 'bg-blue-100 text-blue-700',
  violet: 'bg-violet-100 text-violet-700',
  yellow: 'bg-yellow-100 text-yellow-700',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-0.5 rounded-full font-medium',
      small ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-0.5 text-xs',
      colorMap[props.tag.color ?? ''] ?? 'bg-slate-100 text-slate-700',
    ]"
  >
    <span v-if="tag.emoji">{{ tag.emoji }}</span>
    {{ tag.label }}
  </span>
</template>
