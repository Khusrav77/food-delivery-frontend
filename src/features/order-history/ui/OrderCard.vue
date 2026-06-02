<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ChevronRight, RefreshCw, Truck } from 'lucide-vue-next'
import type { PlacedOrder } from '@/entities/order'
import { STATUS_META } from '@/entities/order'
import { formatDateTime } from '@/shared/lib/date'
import { formatPrice } from '@/shared/lib/money'
import { useReorder } from '../model/useReorder'

const props = defineProps<{ order: PlacedOrder }>()
const emit = defineEmits<{ detail: [id: string] }>()

const { loading: reordering, reorder } = useReorder()

// Активный заказ ещё в процессе доставки — показываем ссылку на трекинг (§1.7).
const isActive = computed(
  () => props.order.status !== 'delivered' && props.order.status !== 'cancelled',
)
</script>

<template>
  <div class="bg-surface rounded-2xl border border-line p-4 sm:p-5 hover:border-ink/15 transition-colors">
    <div class="flex items-start justify-between gap-3 mb-3">
      <div>
        <span class="text-sm font-semibold text-ink">Заказ №{{ order.number }}</span>
        <p class="text-xs text-faint mt-0.5">{{ formatDateTime(order.createdAt) }}</p>
      </div>
      <span
        class="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border"
        :class="STATUS_META[order.status].badgeClass"
      >
        {{ STATUS_META[order.status].label }}
      </span>
    </div>

    <!-- Items preview -->
    <ul class="space-y-1 mb-3">
      <li
        v-for="item in order.payload.items.slice(0, 3)"
        :key="item.menuItemId"
        class="text-sm text-muted"
      >
        {{ item.productName }}
        <span v-if="item.variantName" class="text-faint">· {{ item.variantName }}</span>
        <span class="text-faint"> × {{ item.quantity }}</span>
      </li>
      <li v-if="order.payload.items.length > 3" class="text-xs text-faint">
        +{{ order.payload.items.length - 3 }} позиции
      </li>
    </ul>

    <div class="flex items-center justify-between pt-3 border-t border-line gap-2">
      <span class="font-semibold text-ink">{{ formatPrice(order.total) }}</span>
      <div class="flex items-center gap-2">
        <RouterLink
          v-if="isActive"
          :to="`/orders/${order.id}/track`"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-accent text-sm font-medium text-accent
                 hover:bg-accent-soft transition-colors
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          @click.stop
        >
          <Truck :size="13" />
          Отследить
        </RouterLink>
        <button
          v-else
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line text-sm font-medium text-muted
                 hover:text-ink hover:border-ink/20 transition-colors disabled:opacity-50
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          :disabled="reordering"
          @click.stop="reorder(order)"
        >
          <RefreshCw :size="13" :class="reordering ? 'animate-spin' : ''" />
          Повторить
        </button>
        <button
          class="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-accent-soft text-accent text-sm font-medium
                 hover:bg-orange-100 transition-colors
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          @click="emit('detail', order.id)"
        >
          Подробнее
          <ChevronRight :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>
