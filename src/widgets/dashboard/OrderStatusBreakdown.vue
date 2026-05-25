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
  { label: 'Готовится',  count: 22,  pct: 9,  color: 'bg-accent' },
  { label: 'Ожидает',    count: 13,  pct: 5,  color: 'bg-yellow-400' },
]
</script>

<template>
  <div class="bg-surface rounded-2xl border border-line p-5">
    <h2 class="text-sm font-semibold text-ink mb-4">Статусы заказов</h2>
    <div class="space-y-3">
      <div v-for="item in items" :key="item.label">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs text-muted">{{ item.label }}</span>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-ink">{{ item.count }}</span>
            <span class="text-xs text-faint">{{ item.pct }}%</span>
          </div>
        </div>
        <div class="h-2 bg-line rounded-full overflow-hidden">
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
