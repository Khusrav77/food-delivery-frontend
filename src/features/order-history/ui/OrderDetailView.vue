<script setup lang="ts">
import { ArrowLeft, RefreshCw, MapPin, CreditCard, MessageSquare } from 'lucide-vue-next'
import type { PlacedOrder } from '@/entities/order'
import { STATUS_META, PAYMENT_LABEL, OrderStatusTimeline } from '@/entities/order'
import { formatDateTime } from '@/shared/lib/date'
import { formatPrice } from '@/shared/lib/money'
import { useReorder } from '../model/useReorder'

defineProps<{ order: PlacedOrder }>()
const emit = defineEmits<{ back: [] }>()

const { loading: reordering, reorder } = useReorder()
</script>

<template>
  <div class="space-y-5">
    <!-- Back -->
    <button
      class="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink transition-colors
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-lg"
      @click="emit('back')"
    >
      <ArrowLeft :size="15" />
      К списку заказов
    </button>

    <!-- Header -->
    <div class="bg-surface rounded-2xl border border-line p-5 space-y-4">
      <div class="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 class="text-lg font-semibold text-ink">Заказ №{{ order.number }}</h2>
          <p class="text-sm text-faint mt-0.5">{{ formatDateTime(order.createdAt) }}</p>
        </div>
        <span
          class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border"
          :class="STATUS_META[order.status].badgeClass"
        >
          {{ STATUS_META[order.status].label }}
        </span>
      </div>

      <!-- Status timeline -->
      <OrderStatusTimeline :status="order.status" />
    </div>

    <!-- Items -->
    <div class="bg-surface rounded-2xl border border-line p-5">
      <h3 class="text-sm font-semibold text-ink mb-3">Состав заказа</h3>
      <ul class="space-y-2.5">
        <li
          v-for="item in order.payload.items"
          :key="item.menuItemId"
          class="flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-9 h-9 rounded-lg bg-canvas border border-line shrink-0 flex items-center justify-center text-faint text-xs">
              {{ item.productName[0] }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-ink truncate">{{ item.productName }}</p>
              <p class="text-xs text-faint">{{ item.variantName }} · {{ item.quantity }} шт.</p>
            </div>
          </div>
          <span class="text-sm font-semibold text-ink shrink-0">{{ formatPrice(item.price * item.quantity) }}</span>
        </li>
      </ul>
    </div>

    <!-- Details -->
    <div class="bg-surface rounded-2xl border border-line p-5 space-y-3">
      <h3 class="text-sm font-semibold text-ink">Детали</h3>

      <div class="flex items-start gap-2 text-sm">
        <MapPin :size="15" class="text-faint shrink-0 mt-0.5" />
        <span class="text-muted">{{ order.payload.address }}</span>
      </div>
      <div class="flex items-center gap-2 text-sm">
        <CreditCard :size="15" class="text-faint shrink-0" />
        <span class="text-muted">{{ PAYMENT_LABEL[order.payload.paymentMethod] }}</span>
      </div>
      <div v-if="order.payload.comment" class="flex items-start gap-2 text-sm">
        <MessageSquare :size="15" class="text-faint shrink-0 mt-0.5" />
        <span class="text-muted">{{ order.payload.comment }}</span>
      </div>
    </div>

    <!-- Totals -->
    <div class="bg-surface rounded-2xl border border-line p-5 space-y-2">
      <h3 class="text-sm font-semibold text-ink mb-3">Итог</h3>
      <div class="flex justify-between text-sm text-muted">
        <span>Товары</span>
        <span>{{ formatPrice(order.payload.subtotal) }}</span>
      </div>
      <div class="flex justify-between text-sm text-muted">
        <span>Доставка</span>
        <span>{{ order.payload.deliveryCost === 0 ? 'Бесплатно' : formatPrice(order.payload.deliveryCost) }}</span>
      </div>
      <div v-if="order.payload.promoDiscount > 0" class="flex justify-between text-sm text-emerald-600">
        <span>Промокод{{ order.payload.promoCode ? ` (${order.payload.promoCode})` : '' }}</span>
        <span>−{{ formatPrice(order.payload.promoDiscount) }}</span>
      </div>
      <div v-if="order.payload.bonusUsed > 0" class="flex justify-between text-sm text-emerald-600">
        <span>Бонусы</span>
        <span>−{{ order.payload.bonusUsed }} ₽</span>
      </div>
      <div v-if="order.payload.tip > 0" class="flex justify-between text-sm text-muted">
        <span>Чаевые</span>
        <span>+{{ formatPrice(order.payload.tip) }}</span>
      </div>
      <div class="flex justify-between font-semibold text-ink pt-2 border-t border-line">
        <span>Итого</span>
        <span>{{ formatPrice(order.total) }}</span>
      </div>
    </div>

    <!-- Reorder -->
    <button
      class="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-accent text-accent font-semibold
             hover:bg-accent-soft transition-colors disabled:opacity-50
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      :disabled="reordering"
      @click="reorder(order)"
    >
      <RefreshCw :size="16" :class="reordering ? 'animate-spin' : ''" />
      {{ reordering ? 'Добавляем в корзину...' : 'Повторить заказ' }}
    </button>
  </div>
</template>
