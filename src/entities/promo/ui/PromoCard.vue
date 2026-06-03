<script setup lang="ts">
import { ref } from 'vue'
import { Copy, Check } from 'lucide-vue-next'
import type { IPromoCode } from '../model/types'
import { formatDate } from '@/shared/lib/date'

defineProps<{ promo: IPromoCode }>()

const copied = ref(false)

async function copyCode(code: string): Promise<void> {
  await navigator.clipboard.writeText(code)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function formatDiscount(promo: IPromoCode): string {
  return promo.type === 'percent'
    ? `−${Math.round(promo.value * 100)}%`
    : `−${promo.value} ₽`
}
</script>

<template>
  <div class="relative bg-surface rounded-2xl border border-line p-4 flex flex-col gap-3 overflow-hidden">
    <!-- Decorative dashes on left -->
    <div class="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-l-2xl" />

    <div class="pl-3 flex items-start justify-between gap-2">
      <div class="min-w-0">
        <p class="text-sm font-semibold text-ink">{{ promo.description }}</p>
        <p v-if="promo.minOrder > 0" class="text-xs text-faint mt-0.5">
          При заказе от {{ promo.minOrder }} ₽
        </p>
        <p v-if="promo.expiresAt" class="text-xs text-faint mt-0.5">
          До {{ formatDate(promo.expiresAt) }}
        </p>
      </div>
      <span class="shrink-0 px-2.5 py-1 rounded-xl bg-accent-soft text-accent text-sm font-bold">
        {{ formatDiscount(promo) }}
      </span>
    </div>

    <div class="pl-3 flex items-center justify-between gap-2 pt-2 border-t border-line">
      <code class="text-sm font-mono font-semibold text-ink tracking-wider">{{ promo.code }}</code>
      <button
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        :class="copied
          ? 'bg-emerald-50 text-emerald-600'
          : 'bg-canvas border border-line text-muted hover:border-accent/50 hover:text-accent'"
        @click="copyCode(promo.code)"
      >
        <component :is="copied ? Check : Copy" :size="13" />
        {{ copied ? 'Скопировано' : 'Копировать' }}
      </button>
    </div>
  </div>
</template>
