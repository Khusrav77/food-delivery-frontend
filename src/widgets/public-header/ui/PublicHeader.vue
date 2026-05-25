<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ShoppingCart, MapPin, ChevronDown, UtensilsCrossed } from 'lucide-vue-next'

const cartCount = ref(0)
</script>

<template>
  <header class="sticky top-0 z-50 bg-surface/85 backdrop-blur-md border-b border-line">
    <div class="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center gap-4 md:gap-6">

      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2.5 shrink-0 group">
        <div class="w-9 h-9 rounded-md bg-accent flex items-center justify-center">
          <UtensilsCrossed :size="16" class="text-white" />
        </div>
        <span class="font-display font-semibold text-ink text-xl leading-none tracking-tight">FoodHub</span>
      </RouterLink>

      <!-- Address picker -->
      <button class="hidden sm:flex items-center gap-2 text-muted hover:text-ink transition-colors text-sm group">
        <MapPin :size="15" class="text-accent shrink-0" />
        <span>Укажите адрес</span>
        <ChevronDown :size="13" class="text-faint group-hover:text-muted" />
      </button>

      <div class="flex-1" />

      <!-- Login -->
      <RouterLink
        to="/admin/dashboard"
        class="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-ink border border-line-strong rounded-lg hover:bg-surface-soft hover:border-ink/30 transition-colors"
      >
        Войти
      </RouterLink>

      <!-- Cart -->
      <button
        class="relative flex items-center justify-center w-10 h-10 rounded-lg border border-line-strong text-ink hover:bg-surface-soft hover:border-ink/30 transition-colors"
        aria-label="Корзина"
      >
        <ShoppingCart :size="18" />
        <span
          v-if="cartCount > 0"
          class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-accent text-white text-xs flex items-center justify-center px-1 font-medium leading-none"
        >
          {{ cartCount }}
        </span>
      </button>

    </div>
  </header>
</template>
