<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import {
  LayoutDashboard, ShoppingBag, Store, UtensilsCrossed,
  Bike, Users, BarChart3, Tag, Settings, ChevronRight, MapPin, Gift, Images,
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
      { label: 'Зоны доставки', to: '/admin/delivery-zones', icon: MapPin },
      { label: 'Промоакции', to: '/admin/promotions', icon: Tag },
      { label: 'Баннеры', to: '/admin/banners', icon: Images },
      { label: 'Бонусы', to: '/admin/bonus-settings', icon: Gift },
    ],
  },
  {
    title: 'Аналитика',
    items: [
      { label: 'Аналитика', to: '/admin/analytics', icon: BarChart3 },
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
  <aside class="flex flex-col w-64 min-h-screen bg-surface border-r border-line text-muted shrink-0">
    <!-- Logo -->
    <div class="flex items-center gap-3 px-5 py-5 border-b border-line">
      <div class="flex items-center justify-center w-9 h-9 rounded-md bg-accent text-white font-display font-semibold text-lg shrink-0">
        F
      </div>
      <div>
        <p class="font-display text-ink font-semibold text-base leading-tight tracking-tight">FoodHub</p>
        <p class="text-faint text-xs">Admin Panel</p>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-6">
      <div v-for="group in groups" :key="group.title">
        <p class="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-faint">
          {{ group.title }}
        </p>
        <ul class="space-y-0.5">
          <li v-for="item in group.items" :key="item.to">
            <RouterLink
              :to="item.to"
              class="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
              :class="isActive(item.to)
                ? 'bg-accent-soft text-accent'
                : 'text-muted hover:bg-surface-soft hover:text-ink'"
            >
              <component
                :is="item.icon"
                class="w-4.5 h-4.5 shrink-0 transition-colors"
                :class="isActive(item.to) ? 'text-accent' : 'text-faint group-hover:text-ink'"
                :size="18"
              />
              <span class="flex-1">{{ item.label }}</span>
              <ChevronRight
                v-if="isActive(item.to)"
                :size="14"
                class="text-accent/60"
              />
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- User profile -->
    <div class="px-3 pb-4 pt-3 border-t border-line">
      <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-soft cursor-pointer transition-colors">
        <div class="w-8 h-8 rounded-full bg-accent-soft flex items-center justify-center text-accent text-xs font-bold shrink-0">
          A
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-ink text-sm font-medium truncate">Admin User</p>
          <p class="text-faint text-xs truncate">admin@foodhub.com</p>
        </div>
      </div>
    </div>
  </aside>
</template>
