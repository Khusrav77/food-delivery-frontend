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
  <header class="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-4 shrink-0">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-1.5 text-sm text-slate-500 flex-1">
      <span>Панель</span>
      <ChevronRight :size="14" class="text-slate-300" />
      <span class="text-slate-800 font-semibold">{{ breadcrumb }}</span>
    </div>

    <!-- Search -->
    <div class="hidden md:flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 w-56 border border-slate-100">
      <Search :size="15" class="text-slate-400" />
      <input
        type="text"
        placeholder="Поиск..."
        class="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
      />
    </div>

    <!-- Notifications -->
    <button class="relative p-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-500 hover:text-slate-700">
      <Bell :size="18" />
      <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white" />
    </button>

    <!-- Avatar -->
    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
      A
    </div>
  </header>
</template>
