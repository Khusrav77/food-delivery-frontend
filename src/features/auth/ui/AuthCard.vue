<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { UtensilsCrossed } from 'lucide-vue-next'

defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="min-h-screen bg-canvas flex flex-col items-center justify-center px-4 py-10">
    <div class="w-full max-w-[420px]">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2.5 justify-center mb-8">
        <div class="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-sm">
          <UtensilsCrossed :size="18" class="text-white" />
        </div>
        <span class="font-display font-bold text-ink text-2xl leading-none tracking-tight">FoodHub</span>
      </RouterLink>

      <!-- Card -->
      <div class="bg-surface rounded-3xl border border-line shadow-sm px-8 py-8">
        <div class="mb-6 text-center">
          <h1 class="font-display font-extrabold text-ink text-2xl leading-tight">{{ title }}</h1>
          <p v-if="subtitle" class="text-muted text-sm mt-1.5">{{ subtitle }}</p>
        </div>

        <slot />
      </div>
    </div>
  </div>
</template>
