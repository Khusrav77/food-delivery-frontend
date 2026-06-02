<script setup lang="ts">
import { Clock, MapPin, CreditCard, MessageSquare, XCircle, Ban } from 'lucide-vue-next'
import type { PlacedOrder } from '@/entities/order'
import { STATUS_META, PAYMENT_LABEL, OrderStatusTimeline } from '@/entities/order'
import { formatDateTime } from '@/shared/lib/date'
import { formatPrice } from '@/shared/lib/money'

const props = defineProps<{
  order: PlacedOrder
  cancellable: boolean
  cancelling: boolean
}>()
const emit = defineEmits<{ cancel: [] }>()

const isCancelled = () => props.order.status === 'cancelled'
const isDelivered = () => props.order.status === 'delivered'
</script>

<template>
  <div class="space-y-5">
    <!-- Header + timeline -->
    <div class="bg-surface rounded-2xl border border-line p-5 sm:p-6 space-y-5">
      <div class="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 class="font-display text-xl font-extrabold text-ink">Заказ №{{ order.number }}</h1>
          <p class="text-sm text-faint mt-0.5">{{ formatDateTime(order.createdAt) }}</p>
        </div>
        <span
          class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border"
          :class="STATUS_META[order.status].badgeClass"
        >
          {{ STATUS_META[order.status].label }}
        </span>
      </div>

      <OrderStatusTimeline :status="order.status" size="lg" />

      <!-- ETA / cancelled banner -->
      <div
        v-if="isCancelled()"
        class="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
      >
        <Ban :size="18" class="shrink-0" />
        <span>Заказ отменён. Если это ошибка — оформите его заново.</span>
      </div>
      <div
        v-else-if="isDelivered()"
        class="flex items-center justify-center gap-2 text-emerald-600 font-medium"
      >
        <Clock :size="18" />
        <span>Заказ доставлен. Приятного аппетита!</span>
      </div>
      <div v-else class="flex items-center justify-center gap-2 text-accent font-medium">
        <Clock :size="18" />
        <span>Осталось примерно {{ order.etaMinutes }} мин</span>
      </div>
    </div>

    <!-- Items -->
    <div class="bg-surface rounded-2xl border border-line p-5">
      <h2 class="text-sm font-semibold text-ink mb-3">Состав заказа</h2>
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
      <h2 class="text-sm font-semibold text-ink">Доставка</h2>
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
      <h2 class="text-sm font-semibold text-ink mb-3">Итог</h2>
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

    <!-- Cancel -->
    <button
      v-if="cancellable"
      class="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-200 text-red-600 font-semibold
             hover:bg-red-50 transition-colors disabled:opacity-50
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
      :disabled="cancelling"
      @click="emit('cancel')"
    >
      <XCircle :size="16" />
      {{ cancelling ? 'Отменяем...' : 'Отменить заказ' }}
    </button>
  </div>
</template>
