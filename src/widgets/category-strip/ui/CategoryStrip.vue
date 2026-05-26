<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  categories: { id: string; name: string }[]
  activeId: string | null
  loading?: boolean
}>()

const emit = defineEmits<{ select: [id: string] }>()

const pillsRef = ref<HTMLElement | null>(null)

// Auto-scroll the active pill into view when the spy changes
watch(() => props.activeId, id => {
  if (!id || !pillsRef.value) return
  const active = pillsRef.value.querySelector(`[data-id="${id}"]`) as HTMLElement | null
  active?.scrollIntoView({ inline: 'nearest', behavior: 'smooth', block: 'nearest' })
})
</script>

<template>
  <!-- Sticky bar: sits below the fixed header (top-16 = 64px) -->
  <div
    class="sticky top-16 z-40 -mx-4 md:-mx-6 px-4 md:px-6
           bg-canvas/95 backdrop-blur-sm border-b border-line"
  >
    <!-- Loading skeleton -->
    <div v-if="loading" class="flex gap-3 py-3 overflow-hidden">
      <div
        v-for="n in 6"
        :key="n"
        class="shrink-0 h-9 rounded-full bg-surface-soft border border-line animate-pulse"
        :style="{ width: `${70 + n * 14}px` }"
      />
    </div>

    <!-- Pills -->
    <div
      v-else-if="categories.length > 0"
      ref="pillsRef"
      class="flex gap-3 overflow-x-auto py-3"
      style="scrollbar-width: none;"
    >
      <button
        v-for="cat in categories"
        :key="cat.id"
        :data-id="cat.id"
        class="shrink-0 px-5 py-2 rounded-full text-sm font-semibold border transition-all"
        :class="activeId === cat.id
          ? 'bg-accent text-white border-accent'
          : 'bg-surface text-muted border-line-strong hover:border-accent hover:text-accent'"
        @click="emit('select', cat.id)"
      >
        {{ cat.name }}
      </button>
    </div>
  </div>
</template>
