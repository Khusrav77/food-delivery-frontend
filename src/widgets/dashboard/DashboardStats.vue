<script setup lang="ts">
import { ShoppingBag, DollarSign, Bike, Store } from 'lucide-vue-next'
import type { Component } from 'vue'
import { StatsCard } from '@/shared/ui/StatsCard'

interface StatItem {
  label: string
  value: string
  trend?: number
  sub: string
  icon: Component
  iconBg: string
  iconColor: string
}

const stats: StatItem[] = [
  {
    label: 'Заказов сегодня',
    value: '248',
    trend: 12,
    sub: 'vs 221 вчера',
    icon: ShoppingBag,
    iconBg: 'bg-accent-soft',
    iconColor: 'text-accent',
  },
  {
    label: 'Выручка сегодня',
    value: '$8 432',
    trend: 8,
    sub: 'vs $7 804 вчера',
    icon: DollarSign,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
  },
  {
    label: 'Курьеры онлайн',
    value: '34',
    trend: undefined,
    sub: '8 недоступны',
    icon: Bike,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    label: 'Активных ресторанов',
    value: '89',
    trend: -3,
    sub: '15 временно закрыты',
    icon: Store,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-500',
  },
]
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    <StatsCard
      v-for="s in stats"
      :key="s.label"
      v-bind="s"
    />
  </div>
</template>
