<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ArrowLeft, Phone, Bike, Package, TrendingUp, MapPin } from 'lucide-vue-next'
import { useAdminCourierStore } from '@/entities/courier'
import { formatDate, formatDateTime } from '@/shared/lib/date'
import { formatPrice } from '@/shared/lib/money'

const route  = useRoute()
const router = useRouter()
const store  = useAdminCourierStore()
const { current: courier, loadingCurrent, currentError } = storeToRefs(store)

onMounted(() => store.fetchOne(route.params.id as string))
</script>

<template>
  <div class="p-6 max-w-3xl space-y-5">
    <button
      class="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink transition-colors
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-lg"
      @click="router.back()"
    >
      <ArrowLeft :size="15" />
      К списку курьеров
    </button>

    <!-- Loading -->
    <template v-if="loadingCurrent && !courier">
      <div v-for="i in 3" :key="i" class="h-28 bg-surface rounded-2xl border border-line animate-pulse" />
    </template>

    <!-- Error -->
    <div v-else-if="currentError" class="py-12 text-center text-sm text-red-500">{{ currentError }}</div>

    <template v-else-if="courier">
      <!-- Profile + stats grid -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Profile card -->
        <div class="lg:col-span-2 bg-surface rounded-2xl border border-line p-5 space-y-3">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-full font-bold text-lg flex items-center justify-center shrink-0"
              :class="courier.isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-canvas text-muted border border-line'"
            >
              {{ courier.name.split(' ').map((w) => w[0]).slice(0, 2).join('') }}
            </div>
            <div>
              <h1 class="font-display text-lg font-extrabold text-ink">{{ courier.name }}</h1>
              <span
                class="inline-flex items-center gap-1.5 text-xs font-semibold"
                :class="courier.isOnline ? 'text-emerald-600' : 'text-faint'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="courier.isOnline ? 'bg-emerald-500' : 'bg-line'" />
                {{ courier.isOnline ? 'Онлайн' : 'Офлайн' }}
              </span>
            </div>
          </div>
          <div class="space-y-2 pt-1">
            <div class="flex items-center gap-2 text-sm text-muted">
              <Phone :size="14" class="text-faint shrink-0" />
              {{ courier.phone }}
            </div>
            <div class="flex items-center gap-2 text-sm text-muted">
              <Bike :size="14" class="text-faint shrink-0" />
              Работает с {{ formatDate(courier.joinedAt) }}
            </div>
          </div>
        </div>

        <!-- Stats card -->
        <div class="bg-surface rounded-2xl border border-line p-5 space-y-3">
          <div class="flex items-center justify-between text-sm">
            <span class="flex items-center gap-1.5 text-faint"><Package :size="13" /> Всего доставок</span>
            <span class="font-bold text-ink">{{ courier.totalDeliveries }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-faint">Активных</span>
            <span class="font-bold text-accent">{{ courier.activeOrdersCount }}</span>
          </div>
          <div class="h-px bg-line" />
          <div class="flex items-center justify-between text-sm">
            <span class="flex items-center gap-1.5 text-faint"><TrendingUp :size="13" /> За неделю</span>
            <span class="font-bold text-ink">{{ formatPrice(courier.earnings.week) }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-faint">За месяц</span>
            <span class="font-bold text-ink">{{ formatPrice(courier.earnings.month) }}</span>
          </div>
        </div>
      </div>

      <!-- Delivery history -->
      <div class="bg-surface rounded-2xl border border-line overflow-hidden">
        <div class="px-5 py-4 border-b border-line">
          <h2 class="text-sm font-semibold text-ink">История доставок</h2>
          <p class="text-xs text-faint mt-0.5">{{ courier.deliveryHistory.length }} записей</p>
        </div>

        <div v-if="courier.deliveryHistory.length === 0" class="py-10 text-center text-sm text-faint">
          Доставок пока нет
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-surface-soft text-left">
                <th class="px-5 py-3 text-xs font-semibold text-faint uppercase tracking-wide">Заказ</th>
                <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide hidden md:table-cell">Клиент</th>
                <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide hidden lg:table-cell">Адрес</th>
                <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide">Дата</th>
                <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide text-right">Выплата</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-line">
              <tr v-for="rec in courier.deliveryHistory" :key="rec.id" class="hover:bg-surface-soft transition-colors">
                <td class="px-5 py-3 font-mono text-xs font-bold text-ink">{{ rec.orderNumber }}</td>
                <td class="px-4 py-3 hidden md:table-cell text-xs text-muted">{{ rec.clientName }}</td>
                <td class="px-4 py-3 hidden lg:table-cell">
                  <div class="flex items-start gap-1 text-xs text-faint max-w-[200px]">
                    <MapPin :size="10" class="mt-0.5 shrink-0" />
                    <span class="truncate">{{ rec.address }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-xs text-faint whitespace-nowrap">{{ formatDateTime(rec.deliveredAt) }}</td>
                <td class="px-4 py-3 text-right font-semibold text-sm whitespace-nowrap"
                    :class="rec.earnings > 0 ? 'text-ink' : 'text-faint'">
                  {{ rec.earnings > 0 ? formatPrice(rec.earnings) : 'Бесплатно' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>
