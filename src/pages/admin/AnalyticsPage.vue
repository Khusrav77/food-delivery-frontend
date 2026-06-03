<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'
import type { TooltipItem } from 'chart.js'
import { Bar, Line, Doughnut } from 'vue-chartjs'
import { TrendingUp, TrendingDown, ShoppingBag, BadgePercent, Star, Tag } from 'lucide-vue-next'
import { useAnalyticsStore, type AnalyticsPeriod } from '@/entities/analytics'
import { formatPrice } from '@/shared/lib/money'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler,
)

const ACCENT      = '#fb923c'
const ACCENT_SOFT = 'rgba(251,146,60,0.15)'
const EMERALD     = '#10b981'
const ORANGE      = '#fb923c'
const GRID        = '#ecebe6'
const FAINT       = '#9c9ca4'

const store  = useAnalyticsStore()
const { report, loading } = storeToRefs(store)

const period = ref<AnalyticsPeriod>('week')
const PERIODS: { value: AnalyticsPeriod; label: string }[] = [
  { value: 'today', label: 'Сегодня' },
  { value: 'week',  label: 'Неделя'  },
  { value: 'month', label: 'Месяц'   },
]

// ── Chart: bar — заказы по дням ──────────────────────────────────────────
const ordersBarData = computed(() => ({
  labels: report.value?.orders.daily.map((d) => d.label) ?? [],
  datasets: [{
    label: 'Заказы',
    data: report.value?.orders.daily.map((d) => d.orders) ?? [],
    backgroundColor: ACCENT,
    borderColor: ACCENT,
    borderRadius: 6,
    borderSkipped: false,
    hoverBackgroundColor: '#f97316',
  }],
}))

const ordersBarOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#18181b',
      titleColor: '#fff',
      bodyColor: '#d4d4d8',
      cornerRadius: 8,
      padding: 10,
      callbacks: { label: (ctx: TooltipItem<'bar'>) => ` ${ctx.parsed.y ?? 0} заказ(ов)` },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: FAINT, font: { size: 11 } } },
    y: {
      grid: { color: GRID },
      ticks: { color: FAINT, font: { size: 11 }, stepSize: 1 },
      beginAtZero: true,
    },
  },
}))

// ── Chart: line — выручка по дням ────────────────────────────────────────
const revenueLineData = computed(() => ({
  labels: report.value?.orders.daily.map((d) => d.label) ?? [],
  datasets: [{
    label: 'Выручка',
    data: report.value?.orders.daily.map((d) => d.revenue) ?? [],
    borderColor: ACCENT,
    backgroundColor: ACCENT_SOFT,
    borderWidth: 2.5,
    fill: true,
    tension: 0.4,
    pointBackgroundColor: ACCENT,
    pointRadius: 4,
    pointHoverRadius: 6,
  }],
}))

const revenueLineOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#18181b',
      titleColor: '#fff',
      bodyColor: '#d4d4d8',
      cornerRadius: 8,
      padding: 10,
      callbacks: { label: (ctx: TooltipItem<'line'>) => ` ${(ctx.parsed.y ?? 0).toLocaleString('ru')} ₽` },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: FAINT, font: { size: 11 } } },
    y: {
      grid: { color: GRID },
      ticks: { color: FAINT, font: { size: 11 }, callback: (v: string | number) => `${(Number(v) / 1000).toFixed(0)}к` },
      beginAtZero: true,
    },
  },
}))

// ── Chart: doughnut — бонусы ─────────────────────────────────────────────
const bonusDonutData = computed(() => ({
  labels: ['Начислено', 'Списано'],
  datasets: [{
    data: [report.value?.bonuses.earned ?? 0, report.value?.bonuses.spent ?? 0],
    backgroundColor: [EMERALD, ORANGE],
    borderWidth: 0,
    hoverOffset: 6,
  }],
}))

const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { color: FAINT, font: { size: 11 }, padding: 16, boxWidth: 12, boxHeight: 12 },
    },
    tooltip: {
      backgroundColor: '#18181b',
      titleColor: '#fff',
      bodyColor: '#d4d4d8',
      cornerRadius: 8,
      padding: 10,
      callbacks: { label: (ctx: TooltipItem<'doughnut'>) => ` ${ctx.label}: ${Number(ctx.raw).toLocaleString('ru')} ₽` },
    },
  },
}

// ── Chart: horizontal bar — топ блюд ─────────────────────────────────────
const topDishesData = computed(() => {
  const dishes = (report.value?.topDishes ?? []).slice(0, 8)
  return {
    labels: dishes.map((d) => d.name),
    datasets: [{
      label: 'Заказов',
      data: dishes.map((d) => d.count),
      backgroundColor: dishes.map((_, i) => `rgba(251,146,60,${1 - i * 0.08})`),
      borderRadius: 4,
      borderSkipped: false,
    }],
  }
})

const topDishesOptions = computed(() => ({
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#18181b',
      titleColor: '#fff',
      bodyColor: '#d4d4d8',
      cornerRadius: 8,
      padding: 10,
      callbacks: { label: (ctx: TooltipItem<'bar'>) => ` ${ctx.parsed.x ?? 0} заказ(ов)` },
    },
  },
  scales: {
    x: {
      grid: { color: GRID },
      ticks: { color: FAINT, font: { size: 11 } },
      beginAtZero: true,
    },
    y: { grid: { display: false }, ticks: { color: '#18181b', font: { size: 12 } } },
  },
}))

// ── Chart: doughnut — промокоды ───────────────────────────────────────────
const promoDonutData = computed(() => {
  const active = (report.value?.promos.byCodes ?? []).filter((p) => p.usages > 0)
  const COLORS = ['#fb923c','#34d399','#60a5fa','#a78bfa','#f472b6','#fbbf24']
  return {
    labels: active.map((p) => p.code),
    datasets: [{
      data: active.map((p) => p.usages),
      backgroundColor: COLORS.slice(0, active.length),
      borderWidth: 0,
      hoverOffset: 6,
    }],
  }
})

watch(period, (p) => store.fetch(p))
onMounted(() => store.fetch(period.value))
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header + period -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="font-display text-xl font-extrabold text-ink">Аналитика</h1>
        <p class="text-xs text-faint mt-0.5">Сводные отчёты по заказам, бонусам и промокодам</p>
      </div>
      <div class="flex gap-1 p-1 bg-canvas rounded-xl border border-line">
        <button
          v-for="p in PERIODS" :key="p.value"
          class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          :class="period === p.value ? 'bg-surface shadow-sm text-ink' : 'text-muted hover:text-ink'"
          @click="period = p.value"
        >
          {{ p.label }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <template v-if="loading || !report">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-24 bg-surface rounded-2xl border border-line animate-pulse" />
      </div>
      <div class="h-72 bg-surface rounded-2xl border border-line animate-pulse" />
    </template>

    <template v-else>
      <!-- ── KPI cards ────────────────────────────────────── -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-surface rounded-2xl border border-line p-4 space-y-1">
          <div class="flex items-center justify-between">
            <p class="text-xs text-faint">Заказов</p>
            <ShoppingBag :size="15" class="text-accent" />
          </div>
          <p class="font-display text-2xl font-extrabold text-ink">{{ report.orders.total }}</p>
          <p class="text-xs text-faint">за период</p>
        </div>
        <div class="bg-surface rounded-2xl border border-line p-4 space-y-1">
          <div class="flex items-center justify-between">
            <p class="text-xs text-faint">Выручка</p>
            <TrendingUp :size="15" class="text-emerald-500" />
          </div>
          <p class="font-display text-2xl font-extrabold text-ink">{{ formatPrice(report.orders.revenue) }}</p>
          <p class="text-xs text-faint">за период</p>
        </div>
        <div class="bg-surface rounded-2xl border border-line p-4 space-y-1">
          <div class="flex items-center justify-between">
            <p class="text-xs text-faint">Средний чек</p>
            <BadgePercent :size="15" class="text-blue-500" />
          </div>
          <p class="font-display text-2xl font-extrabold text-ink">{{ formatPrice(report.orders.avgCheck) }}</p>
          <p class="text-xs text-faint">на заказ</p>
        </div>
        <div class="bg-surface rounded-2xl border border-line p-4 space-y-1">
          <div class="flex items-center justify-between">
            <p class="text-xs text-faint">Отменено</p>
            <TrendingDown :size="15" class="text-red-400" />
          </div>
          <p class="font-display text-2xl font-extrabold text-red-500">{{ report.orders.cancelled }}</p>
          <p class="text-xs text-faint">
            {{ report.orders.total > 0 ? Math.round(report.orders.cancelled / report.orders.total * 100) + '% от всех' : '—' }}
          </p>
        </div>
      </div>

      <!-- ── Bar: динамика заказов | Line: выручка ────────────── -->
      <div class="grid lg:grid-cols-2 gap-4">
        <div class="bg-surface rounded-2xl border border-line p-5">
          <h2 class="text-sm font-semibold text-ink mb-4">Динамика заказов</h2>
          <div class="h-56">
            <Bar :data="ordersBarData" :options="ordersBarOptions" />
          </div>
        </div>
        <div class="bg-surface rounded-2xl border border-line p-5">
          <h2 class="text-sm font-semibold text-ink mb-4">Динамика выручки</h2>
          <div class="h-56">
            <Line :data="revenueLineData" :options="revenueLineOptions" />
          </div>
        </div>
      </div>

      <!-- ── Horizontal Bar: топ блюд ──────────────────────────── -->
      <div class="bg-surface rounded-2xl border border-line p-5">
        <h2 class="text-sm font-semibold text-ink mb-4">Топ блюд по заказам</h2>
        <div :style="{ height: Math.max(280, (report.topDishes.length * 38)) + 'px' }">
          <Bar :data="topDishesData" :options="topDishesOptions" />
        </div>
      </div>

      <!-- ── Doughnut: бонусы | Doughnut: промокоды ────────────── -->
      <div class="grid md:grid-cols-2 gap-4">
        <!-- Бонусы -->
        <div class="bg-surface rounded-2xl border border-line p-5">
          <h2 class="text-sm font-semibold text-ink flex items-center gap-2 mb-1">
            <Star :size="15" class="text-amber-400 fill-amber-400" />
            Бонусы
          </h2>
          <div class="flex items-center gap-2 mb-4">
            <span class="text-xs text-faint">{{ report.bonuses.transactions }} операций</span>
          </div>
          <div class="flex items-center gap-6">
            <div class="h-44 flex-1">
              <Doughnut :data="bonusDonutData" :options="donutOptions" />
            </div>
            <div class="space-y-3 shrink-0">
              <div>
                <p class="text-xs text-faint mb-0.5">Начислено</p>
                <p class="font-bold text-emerald-600">+{{ report.bonuses.earned.toLocaleString('ru') }} ₽</p>
              </div>
              <div>
                <p class="text-xs text-faint mb-0.5">Списано</p>
                <p class="font-bold text-orange-500">−{{ report.bonuses.spent.toLocaleString('ru') }} ₽</p>
              </div>
              <div>
                <p class="text-xs text-faint mb-0.5">Баланс</p>
                <p class="font-bold text-ink">{{ (report.bonuses.earned - report.bonuses.spent).toLocaleString('ru') }} ₽</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Промокоды -->
        <div class="bg-surface rounded-2xl border border-line p-5">
          <h2 class="text-sm font-semibold text-ink flex items-center gap-2 mb-1">
            <Tag :size="15" class="text-accent" />
            Промокоды
          </h2>
          <div class="flex items-center gap-4 mb-4">
            <div>
              <span class="font-bold text-2xl font-display text-ink">{{ report.promos.totalUsages }}</span>
              <span class="text-xs text-faint ml-1">применений</span>
            </div>
            <div>
              <span class="font-bold text-xl font-display text-red-500">−{{ formatPrice(report.promos.totalDiscount) }}</span>
              <span class="text-xs text-faint ml-1">скидок</span>
            </div>
          </div>
          <div v-if="report.promos.byCodes.some(p => p.usages > 0)" class="h-44">
            <Doughnut :data="promoDonutData" :options="donutOptions" />
          </div>
          <p v-else class="text-sm text-faint py-8 text-center">Нет активных промокодов за период</p>
        </div>
      </div>
    </template>
  </div>
</template>
