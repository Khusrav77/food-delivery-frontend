import { Home, Search, ShoppingCart, Heart } from 'lucide-vue-next'
import type { Component } from 'vue'

export interface Tab {
  to: string
  label: string
  icon: Component
  badge?: 'cart' | 'favorites'
  exact?: boolean
}

export const TABS: Tab[] = [
  { to: '/',          label: 'Главная',    icon: Home,         exact: true },
  { to: '/search',    label: 'Поиск',      icon: Search },
  { to: '/cart',      label: 'Корзина',    icon: ShoppingCart, badge: 'cart' },
  { to: '/favorites', label: 'Избранное',  icon: Heart,        badge: 'favorites' },
]
