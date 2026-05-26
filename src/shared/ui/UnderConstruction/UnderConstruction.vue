<script setup lang="ts">
import { Construction } from 'lucide-vue-next'

defineProps<{ title: string }>()
</script>

<template>
  <div class="p-6">
    <div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div class="w-16 h-16 rounded-2xl bg-accent-soft flex items-center justify-center mb-4">
        <slot />
      </div>
      <h1 class="font-display text-2xl font-semibold text-ink mb-2 tracking-tight">{{ title }}</h1>
      <div class="flex items-center gap-2 text-faint text-sm">
        <Construction :size="14" />
        <span>Модуль в разработке — следующая фаза</span>
      </div>
    </div>
  </div>
</template>
