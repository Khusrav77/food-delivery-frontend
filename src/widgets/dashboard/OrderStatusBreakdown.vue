<script setup lang="ts">
interface BreakdownItem {
  label: string
  count: number
  pct: number
  color: string
}

const items: BreakdownItem[] = [
  { label: 'Доставлено', count: 168, pct: 68, color: 'bg-emerald-400' },
  { label: 'В пути',     count: 45,  pct: 18, color: 'bg-blue-400' },
  { label: 'Готовится',  count: 22,  pct: 9,  color: 'bg-orange-400' },
  { label: 'Ожидает',    count: 13,  pct: 5,  color: 'bg-yellow-400' },
]
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
    <h2 class="text-sm font-semibold text-slate-800 mb-4">Статусы заказов</h2>
    <div class="space-y-3">
      <div v-for="item in items" :key="item.label">
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
</template>
