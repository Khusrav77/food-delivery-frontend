<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ShoppingCart, MapPin, ChevronDown, UtensilsCrossed } from 'lucide-vue-next'

const cartCount = ref(0)
</script>

<template>
  <header class="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center gap-4 md:gap-6">

      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2.5 shrink-0">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-sm">
          <UtensilsCrossed :size="17" class="text-white" />
        </div>
        <span class="font-bold text-slate-900 text-lg leading-none">Food Delivery</span>
      </RouterLink>

      <!-- Address picker -->
      <button class="hidden sm:flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm group">
        <MapPin :size="15" class="text-orange-500 shrink-0" />
        <span class="group-hover:text-slate-900">Укажите адрес</span>
        <ChevronDown :size="13" class="text-slate-400 group-hover:text-slate-600" />
      </button>

      <div class="flex-1" />

      <!-- Login -->
      <RouterLink
        to="/admin/dashboard"
        class="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
      >
        Войти
      </RouterLink>

      <!-- Cart -->
      <button
        class="relative flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
        aria-label="Корзина"
      >
        <ShoppingCart :size="18" class="text-slate-600" />
        <span
          v-if="cartCount > 0"
          class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-orange-500 text-white text-xs flex items-center justify-center px-1 font-medium leading-none"
        >
          {{ cartCount }}
        </span>
      </button>

    </div>
  </header>
</template>
