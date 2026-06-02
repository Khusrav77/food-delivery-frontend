<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import type { OrderStatus } from '@/entities/order'
import { STATUS_META } from '@/entities/order'
import type { AdminOrderStatusFilter } from '../model/types'

const status  = defineModel<AdminOrderStatusFilter>('status',  { required: true })
const search  = defineModel<string>('search', { required: true })

const STATUS_TABS: { value: AdminOrderStatusFilter; label: string }[] = [
  { value: 'all',        label: 'Все' },
  { value: 'accepted',   label: STATUS_META.accepted.label },
  { value: 'cooking',    label: STATUS_META.cooking.label },
  { value: 'on_the_way', label: STATUS_META.on_the_way.label },
  { value: 'delivered',  label: STATUS_META.delivered.label },
  { value: 'cancelled',  label: STATUS_META.cancelled.label },
]

function badgeClass(s: OrderStatus | 'all'): string {
  return s === 'all' ? '' : STATUS_META[s].badgeClass
}
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
    <!-- Status tabs -->
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="tab in STATUS_TABS"
        :key="tab.value"
        class="px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        :class="status === tab.value
          ? (tab.value === 'all' ? 'bg-ink text-white border-ink' : ['border', badgeClass(tab.value)])
          : 'bg-canvas border-line text-muted hover:text-ink hover:border-ink/20'"
        @click="status = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Search -->
    <div class="relative sm:ml-auto">
      <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
      <input
        v-model="search"
        type="text"
        placeholder="Поиск по номеру, клиенту или адресу…"
        class="pl-8 pr-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink placeholder:text-faint w-64
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      />
    </div>
  </div>
</template>
