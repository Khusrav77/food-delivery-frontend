<script setup lang="ts">
interface Restaurant {
  name: string
  orders: number
  revenue: string
  rating: number
}

const items: Restaurant[] = [
  { name: 'Burger House',  orders: 42, revenue: '$1 230', rating: 4.8 },
  { name: 'Pizza Roma',    orders: 38, revenue: '$980',   rating: 4.7 },
  { name: 'Sushi Wok',     orders: 31, revenue: '$1 450', rating: 4.9 },
  { name: 'Shawarma King', orders: 27, revenue: '$620',   rating: 4.5 },
]
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-sm font-semibold text-slate-800">Топ рестораны</h2>
      <span class="text-xs text-slate-400">сегодня</span>
    </div>
    <div class="space-y-3">
      <div
        v-for="(r, i) in items"
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
</template>
