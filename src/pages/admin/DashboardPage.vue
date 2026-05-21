<script setup lang="ts">
import { ShoppingBag, DollarSign, Bike, Store, Clock, MapPin, ArrowRight } from 'lucide-vue-next'
import { StatsCard } from '@/shared/ui/StatsCard'

const stats = [
  {
    label: 'Заказов сегодня',
    value: '248',
    trend: 12,
    sub: 'vs 221 вчера',
    icon: ShoppingBag,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
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

interface Order {
  id: string
  customer: string
  restaurant: string
  items: number
  total: string
  status: 'delivered' | 'transit' | 'preparing' | 'pending' | 'cancelled'
  time: string
  district: string
}

const recentOrders: Order[] = [
  { id: '#2481', customer: 'Иван Петров',    restaurant: 'Burger House',   items: 3, total: '$24.50', status: 'delivered',  time: '2 мин',  district: 'Центр' },
  { id: '#2480', customer: 'Мария Иванова',  restaurant: 'Pizza Roma',     items: 2, total: '$18.00', status: 'transit',    time: '8 мин',  district: 'Север' },
  { id: '#2479', customer: 'Олег Смирнов',   restaurant: 'Sushi Wok',      items: 5, total: '$41.20', status: 'preparing',  time: '14 мин', district: 'Запад' },
  { id: '#2478', customer: 'Анна Козлова',   restaurant: 'Shawarma King',  items: 1, total: '$9.90',  status: 'pending',    time: '21 мин', district: 'Восток' },
  { id: '#2477', customer: 'Дмитрий Волков', restaurant: 'Thai Garden',    items: 4, total: '$36.00', status: 'delivered',  time: '35 мин', district: 'Центр' },
  { id: '#2476', customer: 'Елена Новикова', restaurant: 'Pasta House',    items: 2, total: '$22.50', status: 'cancelled',  time: '42 мин', district: 'Юг' },
  { id: '#2475', customer: 'Сергей Лебедев', restaurant: 'Burger House',   items: 3, total: '$28.00', status: 'delivered',  time: '1 ч',    district: 'Центр' },
]

const statusConfig = {
  delivered:  { label: 'Доставлен',  bg: 'bg-emerald-50',  text: 'text-emerald-700',  dot: 'bg-emerald-400' },
  transit:    { label: 'В пути',     bg: 'bg-blue-50',     text: 'text-blue-700',     dot: 'bg-blue-400' },
  preparing:  { label: 'Готовится', bg: 'bg-orange-50',   text: 'text-orange-700',   dot: 'bg-orange-400' },
  pending:    { label: 'Ожидает',   bg: 'bg-yellow-50',   text: 'text-yellow-700',   dot: 'bg-yellow-400' },
  cancelled:  { label: 'Отменён',   bg: 'bg-red-50',      text: 'text-red-600',      dot: 'bg-red-400' },
}

const statusBreakdown = [
  { label: 'Доставлено', count: 168, pct: 68, color: 'bg-emerald-400' },
  { label: 'В пути',     count: 45,  pct: 18, color: 'bg-blue-400' },
  { label: 'Готовится',  count: 22,  pct: 9,  color: 'bg-orange-400' },
  { label: 'Ожидает',    count: 13,  pct: 5,  color: 'bg-yellow-400' },
]

const topRestaurants = [
  { name: 'Burger House',  orders: 42, revenue: '$1 230', rating: 4.8 },
  { name: 'Pizza Roma',    orders: 38, revenue: '$980',   rating: 4.7 },
  { name: 'Sushi Wok',     orders: 31, revenue: '$1 450', rating: 4.9 },
  { name: 'Shawarma King', orders: 27, revenue: '$620',   rating: 4.5 },
]
</script>

<template>
  <div class="p-6 space-y-6">

    <!-- Stats cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatsCard
        v-for="s in stats"
        :key="s.label"
        v-bind="s"
      />
    </div>

    <!-- Main content row -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">

      <!-- Recent orders table -->
      <div class="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 class="text-sm font-semibold text-slate-800">Последние заказы</h2>
            <p class="text-xs text-slate-400 mt-0.5">Обновлено только что</p>
          </div>
          <button class="flex items-center gap-1.5 text-xs text-orange-500 font-medium hover:text-orange-600 transition-colors">
            Все заказы <ArrowRight :size="13" />
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-slate-50 text-left">
                <th class="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Заказ</th>
                <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Клиент</th>
                <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Ресторан</th>
                <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Район</th>
                <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Сумма</th>
                <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Статус</th>
                <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Время</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr
                v-for="order in recentOrders"
                :key="order.id"
                class="hover:bg-slate-50/50 transition-colors cursor-pointer"
              >
                <td class="px-5 py-3.5">
                  <span class="font-mono text-xs font-semibold text-slate-700">{{ order.id }}</span>
                </td>
                <td class="px-4 py-3.5">
                  <span class="text-slate-700 font-medium text-xs">{{ order.customer }}</span>
                </td>
                <td class="px-4 py-3.5 hidden md:table-cell">
                  <span class="text-slate-500 text-xs">{{ order.restaurant }}</span>
                </td>
                <td class="px-4 py-3.5 hidden lg:table-cell">
                  <div class="flex items-center gap-1 text-slate-400 text-xs">
                    <MapPin :size="11" />
                    {{ order.district }}
                  </div>
                </td>
                <td class="px-4 py-3.5">
                  <span class="font-semibold text-slate-800 text-xs">{{ order.total }}</span>
                </td>
                <td class="px-4 py-3.5">
                  <span
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    :class="[statusConfig[order.status].bg, statusConfig[order.status].text]"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="statusConfig[order.status].dot" />
                    {{ statusConfig[order.status].label }}
                  </span>
                </td>
                <td class="px-4 py-3.5 hidden sm:table-cell">
                  <div class="flex items-center gap-1 text-slate-400 text-xs">
                    <Clock :size="11" />
                    {{ order.time }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right column -->
      <div class="space-y-4">

        <!-- Status breakdown -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 class="text-sm font-semibold text-slate-800 mb-4">Статусы заказов</h2>
          <div class="space-y-3">
            <div v-for="item in statusBreakdown" :key="item.label">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-xs text-slate-600">{{ item.label }}</span>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-semibold text-slate-800">{{ item.count }}</span>
                  <span class="text-xs text-slate-400">{{ item.pct }}%</span>
                </div>
              </div>
              <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  :class="item.color"
                  :style="{ width: item.pct + '%' }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Top restaurants -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-semibold text-slate-800">Топ рестораны</h2>
            <span class="text-xs text-slate-400">сегодня</span>
          </div>
          <div class="space-y-3">
            <div
              v-for="(r, i) in topRestaurants"
              :key="r.name"
              class="flex items-center gap-3"
            >
              <span
                class="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                :class="i === 0 ? 'bg-orange-50 text-orange-500' : 'bg-slate-50 text-slate-400'"
              >
                {{ i + 1 }}
              </span>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-slate-700 truncate">{{ r.name }}</p>
                <p class="text-xs text-slate-400">{{ r.orders }} зак. · {{ r.revenue }}</p>
              </div>
              <div class="text-xs font-semibold text-slate-600 shrink-0">★ {{ r.rating }}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
