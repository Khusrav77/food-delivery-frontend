<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Star, TrendingUp, TrendingDown } from 'lucide-vue-next'
import { useUserStore } from '@/entities/user'
import { useBonusStore } from '@/entities/bonus'
import { formatDateTime } from '@/shared/lib/date'

const { user } = storeToRefs(useUserStore())
const bonusStore = useBonusStore()
const { transactions, loading } = storeToRefs(bonusStore)

const totalEarned = computed(() =>
  transactions.value.filter((t) => t.type === 'earn').reduce((s, t) => s + t.amount, 0),
)
const totalSpent = computed(() =>
  transactions.value.filter((t) => t.type === 'spend').reduce((s, t) => s + t.amount, 0),
)

onMounted(bonusStore.fetchAll)
</script>

<template>
  <div class="space-y-5">
    <h2 class="text-lg font-semibold text-ink">Бонусная программа</h2>

    <!-- Balance card -->
    <div class="bg-gradient-to-br from-accent to-emerald-900 rounded-2xl p-5 text-white">
      <p class="text-sm font-medium text-white/80 mb-1">Текущий баланс</p>
      <div class="flex items-end gap-2">
        <span class="text-4xl font-bold">{{ user?.bonusBalance ?? 0 }}</span>
        <span class="text-lg font-semibold text-white/80 mb-0.5">бонусов</span>
      </div>
      <p class="text-xs text-white/70 mt-2">1 бонус = 1 ₽ при оплате заказа</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-surface rounded-2xl border border-line p-4">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
            <TrendingUp :size="14" class="text-emerald-500" />
          </div>
          <span class="text-xs font-medium text-muted">Начислено</span>
        </div>
        <p class="text-xl font-bold text-ink">{{ totalEarned }}</p>
      </div>
      <div class="bg-surface rounded-2xl border border-line p-4">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
            <TrendingDown :size="14" class="text-red-400" />
          </div>
          <span class="text-xs font-medium text-muted">Списано</span>
        </div>
        <p class="text-xl font-bold text-ink">{{ totalSpent }}</p>
      </div>
    </div>

    <!-- Transactions -->
    <div class="bg-surface rounded-2xl border border-line overflow-hidden">
      <div class="px-5 py-4 border-b border-line">
        <h3 class="text-sm font-semibold text-ink">История операций</h3>
      </div>

      <div v-if="loading" class="divide-y divide-line">
        <div v-for="i in 4" :key="i" class="px-5 py-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-canvas animate-pulse" />
          <div class="flex-1 space-y-1.5">
            <div class="h-3 bg-canvas rounded animate-pulse w-48" />
            <div class="h-2.5 bg-canvas rounded animate-pulse w-24" />
          </div>
        </div>
      </div>

      <div v-else-if="transactions.length === 0" class="px-5 py-12 text-center text-sm text-muted">
        История операций пуста
      </div>

      <ul v-else class="divide-y divide-line">
        <li
          v-for="tx in transactions"
          :key="tx.id"
          class="flex items-center gap-3 px-5 py-4"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            :class="tx.type === 'earn' ? 'bg-emerald-50' : 'bg-red-50'"
          >
            <component
              :is="tx.type === 'earn' ? TrendingUp : TrendingDown"
              :size="14"
              :class="tx.type === 'earn' ? 'text-emerald-500' : 'text-red-400'"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-ink">{{ tx.description }}</p>
            <p class="text-xs text-faint mt-0.5">
              {{ formatDateTime(tx.createdAt) }}
              <template v-if="tx.orderNumber">· Заказ №{{ tx.orderNumber }}</template>
            </p>
          </div>
          <span
            class="text-sm font-bold shrink-0"
            :class="tx.type === 'earn' ? 'text-emerald-600' : 'text-red-500'"
          >
            {{ tx.type === 'earn' ? '+' : '−' }}{{ tx.amount }}
            <Star :size="11" class="inline-block" :class="tx.type === 'earn' ? 'fill-emerald-500 text-emerald-500' : 'fill-red-400 text-red-400'" />
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
