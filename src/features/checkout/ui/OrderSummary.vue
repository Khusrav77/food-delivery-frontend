<script setup lang="ts">
import { ShoppingBag, Clock, ArrowRight, Loader2, AlertTriangle } from 'lucide-vue-next'
import type { CartItem } from '@/entities/cart'
import type { TotalsBreakdown, ZoneInfo } from '../model/types'
import { formatPrice } from '@/shared/lib/money'

defineProps<{
  items: CartItem[]
  totals: TotalsBreakdown
  zone: ZoneInfo | null
  zoneLoading: boolean
  etaMinutes: number
  isZoneUnavailable: boolean
  isBelowMinOrder: boolean
  canSubmit: boolean
  placing: boolean
}>()

const emit = defineEmits<{ submit: [] }>()
</script>

<template>
  <section class="bg-surface rounded-2xl border border-line p-5 space-y-4">
    <div class="flex items-center gap-2.5">
      <ShoppingBag :size="18" class="text-accent" />
      <h3 class="font-display font-semibold text-ink text-base leading-none">Ваш заказ</h3>
    </div>

    <!-- Items -->
    <ul class="space-y-2.5">
      <li v-for="item in items" :key="item.menuItemId" class="flex justify-between gap-3 text-sm">
        <span class="text-muted min-w-0">
          <span class="text-ink">{{ item.productName }}</span>
          <span class="text-faint"> · {{ item.variantName }}</span>
          <span class="text-faint"> × {{ item.quantity }}</span>
        </span>
        <span class="text-ink font-medium shrink-0">{{ formatPrice(item.price * item.quantity) }}</span>
      </li>
    </ul>

    <div class="h-px bg-line" />

    <!-- Breakdown -->
    <dl class="space-y-2 text-sm">
      <div class="flex justify-between">
        <dt class="text-muted">Товары</dt>
        <dd class="text-ink">{{ formatPrice(totals.subtotal) }}</dd>
      </div>
      <div class="flex justify-between">
        <dt class="text-muted">Доставка</dt>
        <dd class="text-ink">
          <span v-if="zoneLoading" class="text-faint">…</span>
          <span v-else-if="totals.deliveryCost === 0" class="text-emerald-600">Бесплатно</span>
          <span v-else>{{ formatPrice(totals.deliveryCost) }}</span>
        </dd>
      </div>
      <div v-if="totals.promoDiscount > 0" class="flex justify-between text-emerald-600">
        <dt>Промокод</dt>
        <dd>−{{ formatPrice(totals.promoDiscount) }}</dd>
      </div>
      <div v-if="totals.bonusUsed > 0" class="flex justify-between text-emerald-600">
        <dt>Бонусы</dt>
        <dd>−{{ formatPrice(totals.bonusUsed) }}</dd>
      </div>
      <div v-if="totals.tip > 0" class="flex justify-between">
        <dt class="text-muted">Чаевые</dt>
        <dd class="text-ink">{{ formatPrice(totals.tip) }}</dd>
      </div>
    </dl>

    <div class="h-px bg-line" />

    <div class="flex items-center justify-between">
      <span class="text-muted text-sm">Итого</span>
      <span class="font-display font-bold text-ink text-2xl">{{ formatPrice(totals.total) }}</span>
    </div>

    <div v-if="zone && !isZoneUnavailable" class="flex items-center gap-2 text-sm text-muted">
      <Clock :size="15" class="text-accent" />
      Примерное время доставки ~{{ etaMinutes }} мин
    </div>

    <!-- Blocking notices -->
    <div
      v-if="isBelowMinOrder && zone"
      class="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-amber-50 text-sm text-amber-700"
    >
      <AlertTriangle :size="16" class="shrink-0 mt-0.5" />
      <span>Минимальная сумма заказа для вашей зоны — {{ formatPrice(zone.minOrder) }}.</span>
    </div>

    <button
      type="button"
      class="w-full py-3.5 flex items-center justify-center gap-2
             bg-accent hover:bg-accent-hover active:bg-orange-600
             text-white font-semibold text-sm rounded-xl transition-colors
             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-1"
      :disabled="!canSubmit"
      @click="emit('submit')"
    >
      <Loader2 v-if="placing" :size="16" class="animate-spin" />
      <template v-else>
        Оформить заказ
        <ArrowRight :size="16" />
      </template>
    </button>
  </section>
</template>
