import { User, MapPin, ShoppingBag, Star, Bell, Ticket, CreditCard, Users } from 'lucide-vue-next'
import type { Component } from 'vue'

export interface AccountNavItem {
  to: string
  label: string
  icon: Component
}

export const ACCOUNT_NAV: AccountNavItem[] = [
  { to: '/account/profile',       label: 'Профиль',      icon: User },
  { to: '/account/addresses',     label: 'Адреса',       icon: MapPin },
  { to: '/account/orders',        label: 'Заказы',       icon: ShoppingBag },
  { to: '/account/bonuses',       label: 'Бонусы',       icon: Star },
  { to: '/account/notifications', label: 'Уведомления',  icon: Bell },
  { to: '/account/promo',         label: 'Промокоды',    icon: Ticket },
  { to: '/account/cards',         label: 'Мои карты',    icon: CreditCard },
  { to: '/account/referral',      label: 'Реферальная',  icon: Users },
]
