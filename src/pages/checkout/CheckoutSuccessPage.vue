<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { CheckCircle2, Clock, MapPin, CreditCard } from 'lucide-vue-next'
import { useOrderStore } from '@/entities/order'
import { PAYMENT_LABELS } from '@/features/checkout'
import { formatPrice } from '@/shared/lib/money'

const router = useRouter()
const orderStore = useOrderStore()
const order = computed(() => orderStore.lastOrder)

// Прямой заход без оформленного заказа — возвращаем на главную.
if (!orderStore.lastOrder) router.replace('/')
</script>

<template>
  <main v-if="order" class="max-w-lg mx-auto px-4 pt-12 pb-20">
    <div class="bg-surface rounded-3xl border border-line p-8 text-center space-y-6">
      <div class="w-20 h-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center">
        <CheckCircle2 :size="44" class="text-emerald-500" />
      </div>

      <div class="space-y-1.5">
        <h1 class="font-display text-2xl font-extrabold text-ink">Заказ принят!</h1>
        <p class="text-muted text-sm">
          Заказ <span class="font-semibold text-ink">№ {{ order.number }}</span> оформлен.
          Мы уже начали готовить.
        </p>
      </div>

      <div class="flex items-center justify-center gap-2 text-accent">
        <Clock :size="18" />
        <span class="font-medium">Доставим примерно за {{ order.etaMinutes }} мин</span>
      </div>

      <div class="text-left bg-surface-soft rounded-2xl p-4 space-y-3 text-sm">
        <div class="flex items-start gap-2.5">
          <MapPin :size="16" class="text-muted shrink-0 mt-0.5" />
          <span class="text-ink">{{ order.payload.address }}</span>
        </div>
        <div class="flex items-center gap-2.5">
          <CreditCard :size="16" class="text-muted shrink-0" />
          <span class="text-ink">{{ PAYMENT_LABELS[order.payload.paymentMethod] }}</span>
        </div>
        <div class="h-px bg-line" />
        <div class="flex justify-between items-center">
          <span class="text-muted">Итого</span>
          <span class="font-display font-bold text-ink text-xl">{{ formatPrice(order.total) }}</span>
        </div>
      </div>

      <div class="space-y-2.5">
        <RouterLink
          :to="`/orders/${order.id}/track`"
          class="inline-flex w-full items-center justify-center py-3.5 rounded-xl
                 bg-accent hover:bg-accent-hover active:bg-emerald-900 text-white font-semibold text-sm
                 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          Отследить заказ
        </RouterLink>
        <RouterLink
          to="/"
          class="inline-flex w-full items-center justify-center py-3.5 rounded-xl
                 border border-line text-muted hover:text-ink hover:border-ink/20 font-semibold text-sm
                 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          Вернуться в меню
        </RouterLink>
      </div>
    </div>
  </main>
</template>
