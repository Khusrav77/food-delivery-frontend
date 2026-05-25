<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Bell, Search, ChevronRight } from 'lucide-vue-next'
import { computed } from 'vue'

const route = useRoute()

const breadcrumb = computed(() => {
  const segment = route.path.split('/').pop() ?? 'dashboard'
  const labels: Record<string, string> = {
    dashboard: 'Dashboard',
    orders: 'Заказы',
    restaurants: 'Рестораны',
    menu: 'Меню',
    couriers: 'Курьеры',
    customers: 'Клиенты',
    analytics: 'Аналитика',
    promotions: 'Промоакции',
    settings: 'Настройки',
  }
  return labels[segment] ?? segment
})
</script>

<template>
  <header class="h-16 bg-surface border-b border-line flex items-center px-6 gap-4 shrink-0">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-1.5 text-sm text-muted flex-1">
      <span>Панель</span>
      <ChevronRight :size="14" class="text-faint" />
      <span class="text-ink font-semibold">{{ breadcrumb }}</span>
    </div>

    <!-- Search -->
    <div class="hidden md:flex items-center gap-2 bg-surface-soft rounded-lg px-3 py-2 w-56 border border-line focus-within:border-accent transition-colors">
      <Search :size="15" class="text-faint" />
      <input
        type="text"
        placeholder="Поиск..."
        class="bg-transparent text-sm text-ink placeholder-faint outline-none w-full"
      />
    </div>

    <!-- Notifications -->
    <button class="relative p-2 rounded-lg hover:bg-surface-soft transition-colors text-muted hover:text-ink">
      <Bell :size="18" />
      <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full ring-2 ring-surface" />
    </button>

    <!-- Avatar -->
    <div class="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold cursor-pointer">
      A
    </div>
  </header>
</template>
