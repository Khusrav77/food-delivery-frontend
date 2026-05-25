<script setup lang="ts">
import { Clock, MapPin, ArrowRight } from 'lucide-vue-next'

type OrderStatus = 'delivered' | 'transit' | 'preparing' | 'pending' | 'cancelled'

interface Order {
  id: string
  customer: string
  restaurant: string
  total: string
  status: OrderStatus
  time: string
  district: string
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string; dot: string }> = {
  delivered: { label: 'Доставлен',  bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  transit:   { label: 'В пути',     bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400' },
  preparing: { label: 'Готовится',  bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-400' },
  pending:   { label: 'Ожидает',    bg: 'bg-yellow-50',  text: 'text-yellow-700',  dot: 'bg-yellow-400' },
  cancelled: { label: 'Отменён',    bg: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-400' },
}

const orders: Order[] = [
  { id: '#2481', customer: 'Иван Петров',    restaurant: 'Burger House',  total: '$24.50', status: 'delivered', time: '2 мин',  district: 'Центр' },
  { id: '#2480', customer: 'Мария Иванова',  restaurant: 'Pizza Roma',    total: '$18.00', status: 'transit',   time: '8 мин',  district: 'Север' },
  { id: '#2479', customer: 'Олег Смирнов',   restaurant: 'Sushi Wok',     total: '$41.20', status: 'preparing', time: '14 мин', district: 'Запад' },
  { id: '#2478', customer: 'Анна Козлова',   restaurant: 'Shawarma King', total: '$9.90',  status: 'pending',   time: '21 мин', district: 'Восток' },
  { id: '#2477', customer: 'Дмитрий Волков', restaurant: 'Thai Garden',   total: '$36.00', status: 'delivered', time: '35 мин', district: 'Центр' },
  { id: '#2476', customer: 'Елена Новикова', restaurant: 'Pasta House',   total: '$22.50', status: 'cancelled', time: '42 мин', district: 'Юг' },
  { id: '#2475', customer: 'Сергей Лебедев', restaurant: 'Burger House',  total: '$28.00', status: 'delivered', time: '1 ч',    district: 'Центр' },
]
</script>

<template>
  <div class="bg-surface rounded-2xl border border-line overflow-hidden">
    <div class="flex items-center justify-between px-5 py-4 border-b border-line">
      <div>
        <h2 class="text-sm font-semibold text-ink">Последние заказы</h2>
        <p class="text-xs text-faint mt-0.5">Обновлено только что</p>
      </div>
      <button class="flex items-center gap-1.5 text-xs text-accent font-medium hover:text-accent-hover transition-colors">
        Все заказы <ArrowRight :size="13" />
      </button>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-surface-soft text-left">
            <th class="px-5 py-3 text-xs font-semibold text-faint uppercase tracking-wide">Заказ</th>
            <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide">Клиент</th>
            <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide hidden md:table-cell">Ресторан</th>
            <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide hidden lg:table-cell">Район</th>
            <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide">Сумма</th>
            <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide">Статус</th>
            <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide hidden sm:table-cell">Время</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-line">
          <tr
            v-for="order in orders"
            :key="order.id"
            class="hover:bg-surface-soft transition-colors cursor-pointer"
          >
            <td class="px-5 py-3.5">
              <span class="font-mono text-xs font-semibold text-ink">{{ order.id }}</span>
            </td>
            <td class="px-4 py-3.5">
              <span class="text-ink font-medium text-xs">{{ order.customer }}</span>
            </td>
            <td class="px-4 py-3.5 hidden md:table-cell">
              <span class="text-muted text-xs">{{ order.restaurant }}</span>
            </td>
            <td class="px-4 py-3.5 hidden lg:table-cell">
              <div class="flex items-center gap-1 text-faint text-xs">
                <MapPin :size="11" />
                {{ order.district }}
              </div>
            </td>
            <td class="px-4 py-3.5">
              <span class="font-semibold text-ink text-xs">{{ order.total }}</span>
            </td>
            <td class="px-4 py-3.5">
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                :class="[STATUS_CONFIG[order.status].bg, STATUS_CONFIG[order.status].text]"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="STATUS_CONFIG[order.status].dot" />
                {{ STATUS_CONFIG[order.status].label }}
              </span>
            </td>
            <td class="px-4 py-3.5 hidden sm:table-cell">
              <div class="flex items-center gap-1 text-faint text-xs">
                <Clock :size="11" />
                {{ order.time }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
