<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { MapPin, Phone } from 'lucide-vue-next'
import { useAdminOrderStore, STATUS_META, PAYMENT_LABEL } from '@/entities/order'
import { useAdminOrderFilters, AdminOrderFiltersBar } from '@/features/admin-order-filters'
import { formatDateTime } from '@/shared/lib/date'
import { formatPrice } from '@/shared/lib/money'

const router = useRouter()
const store  = useAdminOrderStore()
const { loadingList, listError } = storeToRefs(store)
const { status, search, filtered } = useAdminOrderFilters()

onMounted(store.fetchAll)

function openOrder(id: string): void {
  router.push(`/admin/orders/${id}`)
}
</script>

<template>
  <div class="p-6 space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="font-display text-xl font-extrabold text-ink">Заказы</h1>
        <p class="text-xs text-faint mt-0.5">{{ filtered.length }} позиций</p>
      </div>
    </div>

    <!-- Filters -->
    <AdminOrderFiltersBar v-model:status="status" v-model:search="search" />

    <!-- Loading -->
    <div v-if="loadingList" class="bg-surface rounded-2xl border border-line overflow-hidden">
      <div v-for="i in 6" :key="i" class="h-14 border-b border-line last:border-0 animate-pulse bg-canvas/50" />
    </div>

    <!-- Error -->
    <div v-else-if="listError" class="py-12 text-center text-sm text-red-500">{{ listError }}</div>

    <!-- Empty -->
    <div v-else-if="filtered.length === 0" class="py-16 flex flex-col items-center gap-3 text-center">
      <div class="w-14 h-14 rounded-2xl bg-canvas border border-line flex items-center justify-center text-2xl">🛍️</div>
      <p class="text-muted text-sm">Нет заказов с такими фильтрами</p>
    </div>

    <!-- Table -->
    <div v-else class="bg-surface rounded-2xl border border-line overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-surface-soft text-left">
              <th class="px-5 py-3 text-xs font-semibold text-faint uppercase tracking-wide whitespace-nowrap">Заказ</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide">Клиент</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide hidden md:table-cell">Адрес</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide hidden lg:table-cell">Оплата</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide">Сумма</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide hidden sm:table-cell">Доставка</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide">Статус</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide hidden xl:table-cell">Курьер</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            <tr
              v-for="order in filtered"
              :key="order.id"
              class="hover:bg-surface-soft transition-colors cursor-pointer"
              @click="openOrder(order.id)"
            >
              <!-- # + дата -->
              <td class="px-5 py-3.5">
                <span class="font-mono text-xs font-bold text-ink block">{{ order.number }}</span>
                <span class="text-[11px] text-faint whitespace-nowrap">{{ formatDateTime(order.createdAt) }}</span>
              </td>

              <!-- Клиент -->
              <td class="px-4 py-3.5">
                <span class="text-ink font-medium text-xs block">{{ order.clientName }}</span>
                <span class="text-[11px] text-faint flex items-center gap-1">
                  <Phone :size="10" />{{ order.clientPhone }}
                </span>
              </td>

              <!-- Адрес -->
              <td class="px-4 py-3.5 hidden md:table-cell max-w-[200px]">
                <div class="flex items-start gap-1 text-faint text-xs">
                  <MapPin :size="11" class="mt-0.5 shrink-0" />
                  <span class="truncate">{{ order.payload.address }}</span>
                </div>
              </td>

              <!-- Оплата -->
              <td class="px-4 py-3.5 hidden lg:table-cell text-xs text-muted whitespace-nowrap">
                {{ PAYMENT_LABEL[order.payload.paymentMethod] }}
              </td>

              <!-- Сумма -->
              <td class="px-4 py-3.5 font-semibold text-ink text-sm whitespace-nowrap">
                {{ formatPrice(order.total) }}
              </td>

              <!-- Доставка -->
              <td class="px-4 py-3.5 hidden sm:table-cell text-xs text-muted whitespace-nowrap">
                {{ order.payload.deliveryCost === 0 ? 'Бесплатно' : formatPrice(order.payload.deliveryCost) }}
              </td>

              <!-- Статус -->
              <td class="px-4 py-3.5">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap"
                  :class="STATUS_META[order.status].badgeClass"
                >
                  {{ STATUS_META[order.status].label }}
                </span>
              </td>

              <!-- Курьер -->
              <td class="px-4 py-3.5 hidden xl:table-cell text-xs text-muted whitespace-nowrap">
                {{ order.courierName ?? '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
