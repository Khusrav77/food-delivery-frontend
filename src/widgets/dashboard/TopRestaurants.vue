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
  <div class="bg-surface rounded-2xl border border-line p-5">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-sm font-semibold text-ink">Топ рестораны</h2>
      <span class="text-xs text-faint">сегодня</span>
    </div>
    <div class="space-y-3">
      <div
        v-for="(r, i) in items"
        :key="r.name"
        class="flex items-center gap-3"
      >
        <span
          class="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
          :class="i === 0 ? 'bg-accent-soft text-accent' : 'bg-surface-soft text-faint'"
        >
          {{ i + 1 }}
        </span>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-ink truncate">{{ r.name }}</p>
          <p class="text-xs text-faint">{{ r.orders }} зак. · {{ r.revenue }}</p>
        </div>
        <div class="text-xs font-semibold text-muted shrink-0">★ {{ r.rating }}</div>
      </div>
    </div>
  </div>
</template>
