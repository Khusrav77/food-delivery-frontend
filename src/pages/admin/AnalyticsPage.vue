<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { TrendingUp, TrendingDown, ShoppingBag, BadgePercent, Star, Tag } from 'lucide-vue-next'
import { useAnalyticsStore, type AnalyticsPeriod } from '@/entities/analytics'
import { formatPrice } from '@/shared/lib/money'

const store = useAnalyticsStore()
const { report, loading } = storeToRefs(store)

const period = ref<AnalyticsPeriod>('week')
const PERIODS: { value: AnalyticsPeriod; label: string }[] = [
  { value: 'today', label: 'Сегодня' },
  { value: 'week',  label: 'Неделя' },
  { value: 'month', label: 'Месяц' },
]

// SVG bar chart helpers
const CHART_H = 140
const CHART_PAD_B = 28

const maxOrders = computed(() =>
  report.value ? Math.max(...report.value.orders.daily.map((d) => d.orders), 1) : 1,
)

function barHeight(orders: number): number {
  return Math.round((orders / maxOrders.value) * (CHART_H - CHART_PAD_B))
}

function barY(orders: number): number {
  return CHART_H - CHART_PAD_B - barHeight(orders)
}

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
          :class="period === p.value
            ? 'bg-surface shadow-sm text-ink'
            : 'text-muted hover:text-ink'"
          @click="period = p.value"
        >
          {{ p.label }}
        </button>
      </div>
    </div>

    <!-- Loading skeleton -->
    <template v-if="loading || !report">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-24 bg-surface rounded-2xl border border-line animate-pulse" />
      </div>
      <div class="h-52 bg-surface rounded-2xl border border-line animate-pulse" />
    </template>

    <template v-else>
      <!-- ─── Заказы: KPI cards ─── -->
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
            {{ report.orders.total > 0
              ? Math.round(report.orders.cancelled / report.orders.total * 100) + '% от всех'
              : '—' }}
          </p>
        </div>
      </div>

      <!-- ─── SVG Bar chart: заказы по периодам ─── -->
      <div class="bg-surface rounded-2xl border border-line p-5">
        <h2 class="text-sm font-semibold text-ink mb-4">Динамика заказов</h2>
        <svg
          :viewBox="`0 0 ${report.orders.daily.length * 52} ${CHART_H}`"
          class="w-full overflow-visible"
          :style="{ height: CHART_H + 'px' }"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--color-accent)" stop-opacity="0.9" />
              <stop offset="100%" stop-color="var(--color-accent)" stop-opacity="0.4" />
            </linearGradient>
          </defs>

          <!-- Horizontal grid lines -->
          <line
            v-for="tick in [0.25, 0.5, 0.75, 1]" :key="tick"
            x1="0" :x2="report.orders.daily.length * 52"
            :y1="(1 - tick) * (CHART_H - CHART_PAD_B)" :y2="(1 - tick) * (CHART_H - CHART_PAD_B)"
            stroke="var(--color-line)" stroke-width="1"
          />

          <!-- Bars -->
          <g v-for="(day, i) in report.orders.daily" :key="i">
            <rect
              :x="i * 52 + 8"
              :y="barY(day.orders)"
              :width="36"
              :height="barHeight(day.orders)"
              rx="5"
              fill="url(#barGrad)"
              class="transition-all duration-300"
            />
            <!-- Value on top -->
            <text
              v-if="day.orders > 0"
              :x="i * 52 + 26"
              :y="barY(day.orders) - 5"
              text-anchor="middle"
              font-size="11"
              font-weight="600"
              fill="var(--color-accent)"
            >{{ day.orders }}</text>
            <!-- X axis label -->
            <text
              :x="i * 52 + 26"
              :y="CHART_H - 6"
              text-anchor="middle"
              font-size="10"
              fill="var(--color-faint)"
            >{{ day.label }}</text>
          </g>
        </svg>
      </div>

      <!-- ─── Топ блюд ─── -->
      <div class="bg-surface rounded-2xl border border-line p-5">
        <h2 class="text-sm font-semibold text-ink mb-4">Топ блюд по заказам</h2>
        <div class="space-y-3">
          <div
            v-for="(dish, i) in report.topDishes" :key="dish.name"
            class="flex items-center gap-3"
          >
            <span class="text-xs font-bold text-faint w-5 text-right shrink-0">{{ i + 1 }}</span>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-ink truncate">{{ dish.name }}</span>
                <span class="text-xs text-faint ml-2 shrink-0">{{ dish.count }} шт.</span>
              </div>
              <div class="h-1.5 bg-canvas rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full bg-accent transition-all duration-500"
                  :style="{ width: Math.round(dish.count / report.topDishes[0].count * 100) + '%' }"
                />
              </div>
            </div>
            <span class="text-xs font-semibold text-muted w-20 text-right shrink-0">{{ formatPrice(dish.revenue) }}</span>
          </div>
        </div>
      </div>

      <!-- ─── Бонусы + Промокоды ─── -->
      <div class="grid md:grid-cols-2 gap-4">
        <!-- Бонусы -->
        <div class="bg-surface rounded-2xl border border-line p-5 space-y-4">
          <h2 class="text-sm font-semibold text-ink flex items-center gap-2">
            <Star :size="15" class="text-amber-400 fill-amber-400" />
            Бонусы
          </h2>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span class="text-sm text-muted">Начислено</span>
              </div>
              <span class="font-bold text-emerald-600">+{{ report.bonuses.earned.toLocaleString('ru') }} ₽</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full bg-orange-400" />
                <span class="text-sm text-muted">Списано</span>
              </div>
              <span class="font-bold text-orange-600">−{{ report.bonuses.spent.toLocaleString('ru') }} ₽</span>
            </div>
            <!-- Visual ratio bar -->
            <div class="h-2 bg-canvas rounded-full overflow-hidden flex">
              <div
                class="h-full bg-emerald-400 transition-all duration-500"
                :style="{ width: Math.round(report.bonuses.earned / (report.bonuses.earned + report.bonuses.spent) * 100) + '%' }"
              />
              <div class="h-full bg-orange-400 flex-1" />
            </div>
            <p class="text-xs text-faint">{{ report.bonuses.transactions }} операций за период</p>
          </div>
        </div>

        <!-- Промокоды -->
        <div class="bg-surface rounded-2xl border border-line p-5 space-y-4">
          <h2 class="text-sm font-semibold text-ink flex items-center gap-2">
            <Tag :size="15" class="text-accent" />
            Промокоды
          </h2>
          <div class="flex gap-4 mb-2">
            <div>
              <p class="text-2xl font-extrabold font-display text-ink">{{ report.promos.totalUsages }}</p>
              <p class="text-xs text-faint">применений</p>
            </div>
            <div>
              <p class="text-2xl font-extrabold font-display text-red-500">−{{ formatPrice(report.promos.totalDiscount) }}</p>
              <p class="text-xs text-faint">скидок выдано</p>
            </div>
          </div>
          <div class="space-y-2">
            <div
              v-for="promo in report.promos.byCodes.filter(p => p.usages > 0)"
              :key="promo.code"
              class="flex items-center justify-between text-sm"
            >
              <div class="flex items-center gap-2">
                <span class="font-mono text-xs font-bold text-ink">{{ promo.code }}</span>
                <span class="text-xs text-faint">
                  {{ promo.type === 'percent' ? promo.value + '%' : formatPrice(promo.value) }}
                </span>
              </div>
              <div class="flex items-center gap-3 text-xs text-muted">
                <span>{{ promo.usages }} раз</span>
                <span class="text-red-500 font-medium">−{{ formatPrice(promo.discount) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
