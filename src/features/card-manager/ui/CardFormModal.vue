<script setup lang="ts">
import { computed } from 'vue'
import { X } from 'lucide-vue-next'
import type { CardDraft, CardDraftErrors } from '../model/types'
import { detectCardBrand, formatCardNumber, formatExpiry } from '../model/cardDraft'
import { BRAND_NAMES } from '@/entities/card'

const props = defineProps<{
  draft: CardDraft
  errors: CardDraftErrors
  saving: boolean
  serverError: string | null
}>()

const emit = defineEmits<{
  save: []
  close: []
}>()

const brand = computed(() => detectCardBrand(props.draft.number))
const brandLabel = computed(() => BRAND_NAMES[brand.value])

function onNumberInput(e: Event): void {
  const raw = (e.target as HTMLInputElement).value
  props.draft.number = formatCardNumber(raw)
}

function onExpiryInput(e: Event): void {
  const raw = (e.target as HTMLInputElement).value
  const formatted = formatExpiry(raw)
  props.draft.expMonth = formatted.slice(0, 2)
  props.draft.expYear = formatted.slice(3, 5)
  ;(e.target as HTMLInputElement).value = formatted
}

const expiryDisplay = computed(() => {
  if (!props.draft.expMonth && !props.draft.expYear) return ''
  if (!props.draft.expYear) return props.draft.expMonth
  return `${props.draft.expMonth}/${props.draft.expYear}`
})

const inputBase =
  'w-full px-3 py-2.5 rounded-xl border text-sm text-ink bg-canvas placeholder:text-faint ' +
  'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors'
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div class="w-full max-w-md bg-surface rounded-3xl shadow-xl border border-line">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-line">
          <h3 class="font-semibold text-ink">Добавить карту</h3>
          <button
            class="w-8 h-8 rounded-full flex items-center justify-center text-faint hover:text-ink hover:bg-surface-soft
                   transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            @click="emit('close')"
          >
            <X :size="16" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-5 space-y-4">
          <!-- Card number -->
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <label class="text-xs font-medium text-muted">Номер карты *</label>
              <span v-if="brand !== 'unknown'" class="text-xs font-medium text-accent">{{ brandLabel }}</span>
            </div>
            <input
              type="text"
              inputmode="numeric"
              placeholder="0000 0000 0000 0000"
              maxlength="19"
              :value="draft.number"
              :class="[inputBase, errors.number ? 'border-red-400' : 'border-line']"
              @input="onNumberInput"
            />
            <p v-if="errors.number" class="text-xs text-red-500">{{ errors.number }}</p>
          </div>

          <!-- Expiry + Holder -->
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-xs font-medium text-muted">Срок действия *</label>
              <input
                type="text"
                inputmode="numeric"
                placeholder="MM/YY"
                maxlength="5"
                :value="expiryDisplay"
                :class="[inputBase, errors.expMonth ? 'border-red-400' : 'border-line']"
                @input="onExpiryInput"
              />
              <p v-if="errors.expMonth" class="text-xs text-red-500">{{ errors.expMonth }}</p>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-medium text-muted">Имя держателя *</label>
              <input
                v-model="draft.holder"
                type="text"
                placeholder="IVAN IVANOV"
                :class="[inputBase, errors.holder ? 'border-red-400' : 'border-line']"
                style="text-transform: uppercase"
              />
              <p v-if="errors.holder" class="text-xs text-red-500">{{ errors.holder }}</p>
            </div>
          </div>

          <p v-if="serverError" class="text-sm text-red-500">{{ serverError }}</p>
        </div>

        <!-- Footer -->
        <div class="flex gap-2 px-5 pb-5">
          <button
            class="flex-1 py-2.5 rounded-xl border border-line text-sm font-medium text-muted hover:text-ink
                   hover:bg-surface-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            @click="emit('close')"
          >
            Отмена
          </button>
          <button
            class="flex-1 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-semibold
                   transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            :disabled="saving"
            @click="emit('save')"
          >
            {{ saving ? 'Сохраняем...' : 'Добавить' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
