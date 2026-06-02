<script setup lang="ts">
import { Wallet, CreditCard, QrCode, Check } from 'lucide-vue-next'
import type { Component } from 'vue'
import type { PaymentMethod } from '@/entities/order'
import type { ICard } from '@/entities/card'
import { BRAND_NAMES } from '@/entities/card'
import type { CheckoutDraft } from '../model/types'
import { PAYMENT_LABELS } from '../config/checkout'

const props = defineProps<{
  draft: CheckoutDraft
  savedCards?: ICard[]
}>()

const METHODS: { value: PaymentMethod; icon: Component }[] = [
  { value: 'cash', icon: Wallet },
  { value: 'card', icon: CreditCard },
  { value: 'sbp', icon: QrCode },
]
</script>

<template>
  <section class="bg-surface rounded-2xl border border-line p-5 space-y-4">
    <div class="flex items-center gap-2.5">
      <CreditCard :size="18" class="text-accent" />
      <h3 class="font-display font-semibold text-ink text-base leading-none">Способ оплаты</h3>
    </div>

    <div class="space-y-2.5">
      <button
        v-for="m in METHODS"
        :key="m.value"
        type="button"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-colors
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        :class="
          props.draft.paymentMethod === m.value
            ? 'border-accent bg-accent-soft'
            : 'border-line hover:border-accent/50'
        "
        @click="props.draft.paymentMethod = m.value"
      >
        <component
          :is="m.icon"
          :size="18"
          :class="props.draft.paymentMethod === m.value ? 'text-accent' : 'text-muted'"
        />
        <span class="flex-1 font-medium text-ink">{{ PAYMENT_LABELS[m.value] }}</span>
        <span
          class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
          :class="props.draft.paymentMethod === m.value ? 'border-accent bg-accent' : 'border-line'"
        >
          <Check v-if="props.draft.paymentMethod === m.value" :size="12" class="text-white" />
        </span>
      </button>
    </div>

    <!-- Saved cards picker (visible only when paymentMethod === 'card') -->
    <div
      v-if="props.draft.paymentMethod === 'card' && savedCards && savedCards.length > 0"
      class="pt-1 space-y-2"
    >
      <p class="text-xs font-medium text-muted">Выберите карту</p>
      <button
        v-for="card in savedCards"
        :key="card.id"
        type="button"
        class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-sm text-left transition-colors
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        :class="
          props.draft.savedCardId === card.id
            ? 'border-accent bg-accent-soft'
            : 'border-line hover:border-accent/50'
        "
        @click="props.draft.savedCardId = card.id"
      >
        <span class="font-medium text-ink flex-1">
          {{ BRAND_NAMES[card.brand] }} •••• {{ card.last4 }}
        </span>
        <span class="text-xs text-faint">{{ card.expMonth }}/{{ card.expYear }}</span>
        <span
          class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
          :class="props.draft.savedCardId === card.id ? 'border-accent bg-accent' : 'border-line'"
        >
          <Check v-if="props.draft.savedCardId === card.id" :size="10" class="text-white" />
        </span>
      </button>
    </div>
  </section>
</template>
