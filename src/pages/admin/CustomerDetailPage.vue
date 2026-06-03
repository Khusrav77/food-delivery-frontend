<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ArrowLeft, Phone, Mail, Calendar, Star, TrendingUp, TrendingDown, Plus, Minus } from 'lucide-vue-next'
import { useAdminCustomerStore, BONUS_TX_LABEL, type AdminBonusTxType } from '@/entities/customer'
import { useToastStore } from '@/shared/lib/toast'
import { formatDate, formatDateTime } from '@/shared/lib/date'
import { formatPrice } from '@/shared/lib/money'

const route  = useRoute()
const router = useRouter()
const store  = useAdminCustomerStore()
const toast  = useToastStore()
const { current: customer, loadingCurrent, currentError } = storeToRefs(store)

// Bonus adjustment form
const adjustOpen = ref(false)
const adjusting  = ref(false)
const draft = reactive({ type: 'add' as 'add' | 'deduct', amount: '', comment: '' })

const canAdjust = computed(() =>
  Number(draft.amount) > 0 && draft.comment.trim().length > 0 && !adjusting.value,
)

const TX_ICON: Record<AdminBonusTxType, { icon: typeof TrendingUp; cls: string }> = {
  earn:          { icon: TrendingUp,   cls: 'text-emerald-500' },
  spend:         { icon: TrendingDown, cls: 'text-red-500' },
  manual_add:    { icon: Plus,         cls: 'text-blue-500' },
  manual_deduct: { icon: Minus,        cls: 'text-orange-500' },
}

onMounted(() => store.fetchOne(route.params.id as string))

async function submitAdjust(): Promise<void> {
  if (!customer.value) return
  adjusting.value = true
  try {
    await store.adjustBonus(customer.value.id, {
      type: draft.type,
      amount: Number(draft.amount),
      comment: draft.comment.trim(),
    })
    toast.success(draft.type === 'add' ? 'Бонусы начислены' : 'Бонусы списаны')
    draft.amount  = ''
    draft.comment = ''
    adjustOpen.value = false
  } catch {
    toast.error('Не удалось скорректировать бонусы')
  } finally {
    adjusting.value = false
  }
}
</script>

<template>
  <div class="p-6 max-w-4xl space-y-5">
    <!-- Back -->
    <button
      class="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink transition-colors
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-lg"
      @click="router.back()"
    >
      <ArrowLeft :size="15" />
      К списку клиентов
    </button>

    <!-- Loading -->
    <template v-if="loadingCurrent && !customer">
      <div v-for="i in 3" :key="i" class="h-32 bg-surface rounded-2xl border border-line animate-pulse" />
    </template>

    <!-- Error -->
    <div v-else-if="currentError" class="py-12 text-center text-sm text-red-500">{{ currentError }}</div>

    <template v-else-if="customer">
      <!-- Top grid: info + stats -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Info card -->
        <div class="lg:col-span-2 bg-surface rounded-2xl border border-line p-5 space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-accent-soft text-accent font-bold text-lg flex items-center justify-center shrink-0">
              {{ customer.name.split(' ').map((w) => w[0]).slice(0, 2).join('') }}
            </div>
            <div>
              <h1 class="font-display text-lg font-extrabold text-ink">{{ customer.name }}</h1>
              <p class="text-xs text-faint">ID: {{ customer.id }}</p>
            </div>
          </div>
          <div class="grid sm:grid-cols-2 gap-2 pt-1">
            <div class="flex items-center gap-2 text-sm text-muted">
              <Phone :size="14" class="text-faint shrink-0" />
              {{ customer.phone }}
            </div>
            <div class="flex items-center gap-2 text-sm text-muted">
              <Mail :size="14" class="text-faint shrink-0" />
              {{ customer.email }}
            </div>
            <div class="flex items-center gap-2 text-sm text-muted">
              <Calendar :size="14" class="text-faint shrink-0" />
              Зарегистрирован {{ formatDate(customer.registeredAt) }}
            </div>
          </div>
        </div>

        <!-- Stats card -->
        <div class="bg-surface rounded-2xl border border-line p-5 flex flex-col justify-between gap-4">
          <div class="space-y-3">
            <div class="flex items-center justify-between text-sm">
              <span class="text-faint">Заказов</span>
              <span class="font-bold text-ink text-base">{{ customer.ordersCount }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-faint">Всего потрачено</span>
              <span class="font-bold text-ink">{{ formatPrice(customer.totalSpent) }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-faint">Средний чек</span>
              <span class="font-semibold text-muted">
                {{ customer.ordersCount ? formatPrice(Math.round(customer.totalSpent / customer.ordersCount)) : '—' }}
              </span>
            </div>
            <div class="flex items-center justify-between text-sm border-t border-line pt-3">
              <span class="text-faint flex items-center gap-1"><Star :size="12" class="text-amber-400 fill-amber-400" /> Бонусы</span>
              <span class="font-bold text-amber-500 text-base">{{ customer.bonusBalance }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bonus history + adjustment -->
      <div class="bg-surface rounded-2xl border border-line overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-line">
          <h2 class="text-sm font-semibold text-ink">История бонусов</h2>
          <button
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold
                   bg-accent text-white hover:bg-accent-hover transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            @click="adjustOpen = !adjustOpen"
          >
            <Plus :size="13" />
            Корректировка
          </button>
        </div>

        <!-- Adjustment form -->
        <div v-if="adjustOpen" class="px-5 py-4 border-b border-line bg-surface-soft space-y-3">
          <h3 class="text-xs font-semibold text-faint uppercase tracking-wide">Ручная корректировка</h3>
          <div class="flex flex-wrap gap-3">
            <!-- Type -->
            <div class="flex gap-2">
              <button
                class="px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                :class="draft.type === 'add'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'border-line text-muted hover:text-ink hover:border-ink/20'"
                @click="draft.type = 'add'"
              >
                + Начислить
              </button>
              <button
                class="px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                :class="draft.type === 'deduct'
                  ? 'bg-orange-50 border-orange-300 text-orange-700'
                  : 'border-line text-muted hover:text-ink hover:border-ink/20'"
                @click="draft.type = 'deduct'"
              >
                − Списать
              </button>
            </div>
            <!-- Amount -->
            <input
              v-model="draft.amount"
              type="number"
              min="1"
              placeholder="Сумма бонусов"
              class="w-36 rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink placeholder:text-faint
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            />
            <!-- Comment -->
            <input
              v-model="draft.comment"
              type="text"
              placeholder="Комментарий (обязательно)"
              class="flex-1 min-w-48 rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink placeholder:text-faint
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            />
            <!-- Submit -->
            <button
              class="px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold
                     hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              :disabled="!canAdjust"
              @click="submitAdjust"
            >
              {{ adjusting ? 'Сохраняем…' : 'Применить' }}
            </button>
          </div>
        </div>

        <!-- Transactions -->
        <div v-if="customer.bonusHistory.length === 0" class="py-10 text-center text-sm text-faint">
          Нет операций
        </div>
        <ul v-else class="divide-y divide-line">
          <li
            v-for="tx in customer.bonusHistory"
            :key="tx.id"
            class="flex items-center justify-between gap-3 px-5 py-3.5"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                :class="tx.type === 'earn' || tx.type === 'manual_add' ? 'bg-emerald-50' : 'bg-orange-50'"
              >
                <component
                  :is="TX_ICON[tx.type].icon"
                  :size="15"
                  :class="TX_ICON[tx.type].cls"
                />
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-ink">{{ tx.comment || BONUS_TX_LABEL[tx.type] }}</p>
                <p class="text-xs text-faint">
                  {{ formatDateTime(tx.createdAt) }}
                  <template v-if="tx.orderNumber"> · №{{ tx.orderNumber }}</template>
                </p>
              </div>
            </div>
            <span
              class="text-sm font-bold shrink-0 tabular-nums"
              :class="tx.type === 'earn' || tx.type === 'manual_add' ? 'text-emerald-600' : 'text-red-500'"
            >
              {{ tx.type === 'earn' || tx.type === 'manual_add' ? '+' : '−' }}{{ tx.amount }}
            </span>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>
