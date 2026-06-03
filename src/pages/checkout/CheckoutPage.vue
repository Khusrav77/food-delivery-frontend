<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MessageSquare, ArrowRight, Loader2 } from 'lucide-vue-next'
import { formatPrice } from '@/shared/lib/money'
import { useCartStore } from '@/entities/cart'
import { useToastStore } from '@/shared/lib/toast'
import {
  useCheckout,
  AddressSection,
  PaymentSection,
  PromoBonusSection,
  TipSection,
  OrderSummary,
} from '@/features/checkout'

const router = useRouter()
const cart = useCartStore()
const toast = useToastStore()

const {
  draft, errors,
  zone, zoneLoading, isZoneUnavailable, isBelowMinOrder,
  promo, promoError, promoLoading,
  bonusBalance, maxBonusValue,
  totals, tip, etaMinutes, placing, canSubmit,
  savedAddresses, addressesLoading,
  savedCards,
  init, selectSavedAddress, useNewAddress,
  submitPromo, removePromo, setTipPercent, setTipNone, setTipCustom, submit,
} = useCheckout()

onMounted(() => {
  if (cart.isEmpty) {
    router.replace('/')
    return
  }
  init()
})

async function onSubmit(): Promise<void> {
  const ok = await submit()
  if (ok) {
    toast.success('Заказ принят! Мы уже начали готовить.')
    router.push('/checkout/success')
  } else {
    toast.error('Не удалось оформить заказ. Попробуйте ещё раз.')
  }
}
</script>

<template>
  <main class="max-w-6xl mx-auto px-4 md:px-6 pt-6 pb-32 lg:pb-20">
    <h1 class="font-display text-2xl md:text-3xl font-extrabold text-ink tracking-tight mb-6">
      Оформление заказа
    </h1>

    <div class="grid gap-6 lg:grid-cols-[1fr_380px] items-start">
      <!-- Left: form -->
      <div class="space-y-5">
        <AddressSection
          :draft="draft"
          :saved-addresses="savedAddresses"
          :loading="addressesLoading"
          :zone="zone"
          :zone-loading="zoneLoading"
          :errors="errors"
          @select-saved="selectSavedAddress"
          @use-new="useNewAddress"
        />

        <PaymentSection :draft="draft" :saved-cards="savedCards" />

        <PromoBonusSection
          :draft="draft"
          :promo="promo"
          :promo-error="promoError"
          :promo-loading="promoLoading"
          :bonus-balance="bonusBalance"
          :max-bonus="maxBonusValue"
          @apply-promo="submitPromo"
          @remove-promo="removePromo"
        />

        <TipSection
          :draft="draft"
          :tip="tip"
          @set-percent="setTipPercent"
          @set-none="setTipNone"
          @set-custom="setTipCustom"
        />

        <!-- Order comment -->
        <section class="bg-surface rounded-2xl border border-line p-5 space-y-3">
          <div class="flex items-center gap-2.5">
            <MessageSquare :size="18" class="text-accent" />
            <h3 class="font-display font-semibold text-ink text-base leading-none">
              Комментарий к заказу
            </h3>
          </div>
          <textarea
            v-model="draft.orderComment"
            rows="3"
            placeholder="Код домофона, пожелания к заказу…"
            class="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-line text-ink text-sm
                   placeholder:text-faint resize-none focus-visible:outline-none focus:border-accent
                   focus:ring-2 focus:ring-accent/20 transition-colors"
          />
        </section>
      </div>

      <!-- Right: summary (hidden on mobile, sticky on desktop) -->
      <div class="hidden lg:block lg:sticky lg:top-20">
        <OrderSummary
          :items="cart.items"
          :totals="totals"
          :zone="zone"
          :zone-loading="zoneLoading"
          :eta-minutes="etaMinutes"
          :is-zone-unavailable="isZoneUnavailable"
          :is-below-min-order="isBelowMinOrder"
          :can-submit="canSubmit"
          :placing="placing"
          @submit="onSubmit"
        />
      </div>
    </div>
  </main>

  <!-- Mobile sticky bottom bar -->
  <div class="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-line px-4 py-3 flex items-center gap-3 shadow-[0_-8px_24px_-4px_rgba(0,0,0,0.08)]">
    <div class="flex-1 min-w-0">
      <p class="text-xs text-muted leading-none mb-1">Итого</p>
      <p class="font-display font-bold text-ink text-lg leading-none">{{ formatPrice(totals.total) }}</p>
    </div>
    <button
      type="button"
      class="flex items-center gap-2 px-5 py-3 bg-accent hover:bg-accent-hover active:bg-orange-600
             text-white font-semibold text-sm rounded-xl transition-colors shrink-0
             disabled:opacity-50 disabled:cursor-not-allowed
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      :disabled="!canSubmit"
      @click="onSubmit"
    >
      <Loader2 v-if="placing" :size="16" class="animate-spin" />
      <template v-else>
        Оформить заказ
        <ArrowRight :size="16" />
      </template>
    </button>
  </div>
</template>
