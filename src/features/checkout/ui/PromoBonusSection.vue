<script setup lang="ts">
import { Ticket, Gift, Check, X, Loader2 } from 'lucide-vue-next'
import type { CheckoutDraft, PromoResult } from '../model/types'
import { formatPrice } from '@/shared/lib/money'

const props = defineProps<{
  draft: CheckoutDraft
  promo: PromoResult | null
  promoError: string | null
  promoLoading: boolean
  bonusBalance: number
  maxBonus: number
}>()

const emit = defineEmits<{
  applyPromo: []
  removePromo: []
}>()

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-surface border border-line text-ink text-sm ' +
  'placeholder:text-faint focus-visible:outline-none focus:border-accent focus:ring-2 ' +
  'focus:ring-accent/20 transition-colors'

function applyMaxBonus(): void {
  props.draft.bonusToUse = props.maxBonus
}
</script>

<template>
  <section class="bg-surface rounded-2xl border border-line p-5 space-y-5">
    <!-- Promo code -->
    <div class="space-y-3">
      <div class="flex items-center gap-2.5">
        <Ticket :size="18" class="text-accent" />
        <h3 class="font-display font-semibold text-ink text-base leading-none">Промокод</h3>
      </div>

      <div
        v-if="promo"
        class="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-50 text-sm"
      >
        <span class="flex items-center gap-2 text-emerald-700 font-medium">
          <Check :size="15" />
          {{ promo.code }} — скидка {{ formatPrice(promo.discount) }}
        </span>
        <button
          type="button"
          class="text-emerald-600 hover:text-emerald-800 transition-colors"
          aria-label="Убрать промокод"
          @click="emit('removePromo')"
        >
          <X :size="16" />
        </button>
      </div>

      <template v-else>
        <div class="flex gap-2">
          <input
            v-model="props.draft.promoInput"
            type="text"
            placeholder="Введите код"
            :class="inputClass"
            @keydown.enter.prevent="emit('applyPromo')"
          />
          <button
            type="button"
            class="px-4 py-2.5 rounded-xl bg-ink text-white text-sm font-medium shrink-0
                   hover:bg-ink/90 transition-colors disabled:opacity-50
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40
                   flex items-center gap-2"
            :disabled="promoLoading || !props.draft.promoInput.trim()"
            @click="emit('applyPromo')"
          >
            <Loader2 v-if="promoLoading" :size="15" class="animate-spin" />
            Применить
          </button>
        </div>
        <p v-if="promoError" class="text-xs text-red-500 px-1">{{ promoError }}</p>
      </template>
    </div>

    <div class="h-px bg-line" />

    <!-- Bonuses -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <Gift :size="18" class="text-accent" />
          <h3 class="font-display font-semibold text-ink text-base leading-none">Бонусы</h3>
        </div>
        <span class="text-xs text-muted">Баланс: {{ bonusBalance }}</span>
      </div>

      <p v-if="bonusBalance === 0" class="text-sm text-muted">
        У вас пока нет бонусов для списания.
      </p>
      <template v-else>
        <div class="flex gap-2 items-center">
          <input
            v-model.number="props.draft.bonusToUse"
            type="number"
            min="0"
            :max="maxBonus"
            placeholder="0"
            :class="inputClass"
          />
          <button
            type="button"
            class="px-4 py-2.5 rounded-xl border border-accent text-accent text-sm font-medium shrink-0
                   hover:bg-accent-soft transition-colors disabled:opacity-50
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            :disabled="maxBonus === 0"
            @click="applyMaxBonus"
          >
            Списать макс.
          </button>
        </div>
        <p class="text-xs text-muted px-1">Можно списать до {{ maxBonus }} бонусов на этот заказ.</p>
      </template>
    </div>
  </section>
</template>
