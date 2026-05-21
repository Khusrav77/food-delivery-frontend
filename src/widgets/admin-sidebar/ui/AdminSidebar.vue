<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import {
  LayoutDashboard, ShoppingBag, Store, UtensilsCrossed,
  Bike, Users, BarChart3, Tag, Settings, ChevronRight,
} from 'lucide-vue-next'

interface NavItem {
  label: string
  to: string
  icon: typeof LayoutDashboard
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const groups: NavGroup[] = [
  {
    title: 'Главное',
    items: [
      { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Заказы', to: '/admin/orders', icon: ShoppingBag },
      { label: 'Рестораны', to: '/admin/restaurants', icon: Store },
    ],
  },
  {
    title: 'Управление',
    items: [
      { label: 'Меню', to: '/admin/menu', icon: UtensilsCrossed },
      { label: 'Курьеры', to: '/admin/couriers', icon: Bike },
      { label: 'Клиенты', to: '/admin/customers', icon: Users },
    ],
  },
  {
    title: 'Аналитика',
    items: [
      { label: 'Аналитика', to: '/admin/analytics', icon: BarChart3 },
      { label: 'Промоакции', to: '/admin/promotions', icon: Tag },
    ],
  },
  {
    title: 'Система',
    items: [
      { label: 'Настройки', to: '/admin/settings', icon: Settings },
    ],
  },
]

const route = useRoute()

function isActive(to: string): boolean {
  return route.path.startsWith(to)
}
</script>

<template>
  <aside class="flex flex-col w-64 min-h-screen bg-slate-900 text-slate-300 shrink-0">
    <!-- Logo -->
    <div class="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
      <div class="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500 text-white font-bold text-lg shrink-0">
        F
      </div>
      <div>
        <p class="text-white font-semibold text-sm leading-tight">FoodHub</p>
        <p class="text-slate-500 text-xs">Admin Panel</p>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-6">
      <div v-for="group in groups" :key="group.title">
        <p class="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          {{ group.title }}
        </p>
        <ul class="space-y-0.5">
          <li v-for="item in group.items" :key="item.to">
            <RouterLink
              :to="item.to"
              class="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
              :class="isActive(item.to)
                ? 'bg-orange-500/10 text-orange-400'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'"
            >
              <component
                :is="item.icon"
                class="w-4.5 h-4.5 shrink-0 transition-colors"
                :class="isActive(item.to) ? 'text-orange-400' : 'text-slate-500 group-hover:text-slate-300'"
                :size="18"
              />
              <span class="flex-1">{{ item.label }}</span>
              <ChevronRight
                v-if="isActive(item.to)"
                :size="14"
                class="text-orange-400/60"
              />
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- User profile -->
    <div class="px-3 pb-4 pt-3 border-t border-slate-800">
      <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors">
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          A
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-slate-200 text-sm font-medium truncate">Admin User</p>
          <p class="text-slate-500 text-xs truncate">admin@foodhub.com</p>
        </div>
      </div>
    </div>
  </aside>
</template>
