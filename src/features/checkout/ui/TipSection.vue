<script setup lang="ts">
import { HandCoins } from 'lucide-vue-next'
import type { CheckoutDraft } from '../model/types'
import { TIP_PERCENTS } from '../config/checkout'
import { formatPrice } from '@/shared/lib/money'

const props = defineProps<{
  draft: CheckoutDraft
  tip: number
}>()

const emit = defineEmits<{
  setPercent: [pct: number]
  setNone: []
  setCustom: []
}>()

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-surface border border-line text-ink text-sm ' +
  'placeholder:text-faint focus-visible:outline-none focus:border-accent focus:ring-2 ' +
  'focus:ring-accent/20 transition-colors'

function isPercentActive(pct: number): boolean {
  return props.draft.tipMode === 'percent' && props.draft.tipPercent === pct
}

const chipClass =
  'px-4 py-2 rounded-xl border text-sm font-medium transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40'
const chipActive = 'border-accent bg-accent-soft text-ink'
const chipIdle = 'border-line text-muted hover:text-ink hover:border-accent/50'
</script>

<template>
  <section class="bg-surface rounded-2xl border border-line p-5 space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <HandCoins :size="18" class="text-accent" />
        <h3 class="font-display font-semibold text-ink text-base leading-none">Чаевые курьеру</h3>
      </div>
      <span v-if="tip > 0" class="text-sm font-semibold text-accent">{{ formatPrice(tip) }}</span>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        :class="[chipClass, props.draft.tipMode === 'none' ? chipActive : chipIdle]"
        @click="emit('setNone')"
      >
        Без чаевых
      </button>
      <button
        v-for="pct in TIP_PERCENTS"
        :key="pct"
        type="button"
        :class="[chipClass, isPercentActive(pct) ? chipActive : chipIdle]"
        @click="emit('setPercent', pct)"
      >
        {{ Math.round(pct * 100) }}%
      </button>
      <button
        type="button"
        :class="[chipClass, props.draft.tipMode === 'custom' ? chipActive : chipIdle]"
        @click="emit('setCustom')"
      >
        Своя сумма
      </button>
    </div>

    <input
      v-if="props.draft.tipMode === 'custom'"
      v-model.number="props.draft.tipCustom"
      type="number"
      min="0"
      placeholder="Сумма чаевых, ₽"
      :class="inputClass"
    />
  </section>
</template>
