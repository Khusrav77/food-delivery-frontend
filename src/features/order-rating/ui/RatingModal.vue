<script setup lang="ts">
import { watch } from 'vue'
import { X } from 'lucide-vue-next'
import StarRating from './StarRating.vue'
import { useOrderRating } from '../model/useOrderRating'

const props = defineProps<{
  open: boolean
  orderId: string
  orderNumber: string
}>()
const emit = defineEmits<{ close: []; submitted: [] }>()

const { draft, submitting, canSubmit, reset, submit } = useOrderRating()

// Сбрасываем форму при каждом открытии — модал переиспользуется между заказами.
watch(() => props.open, (open) => { if (open) reset() })

async function onSubmit(): Promise<void> {
  const ok = await submit(props.orderId)
  if (ok) emit('submitted')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div class="w-full max-w-md bg-surface rounded-3xl shadow-xl border border-line">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-line">
          <h3 class="font-semibold text-ink">Оцените заказ №{{ orderNumber }}</h3>
          <button
            class="w-8 h-8 rounded-full flex items-center justify-center text-faint hover:text-ink hover:bg-surface-soft
                   transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            @click="emit('close')"
          >
            <X :size="16" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-5 space-y-5">
          <div class="flex flex-col items-center gap-2 text-center">
            <p class="text-sm text-muted">Понравился ли вам заказ?</p>
            <StarRating v-model="draft.stars" />
          </div>

          <textarea
            v-model="draft.comment"
            rows="3"
            placeholder="Комментарий (необязательно)"
            class="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink resize-none
                   placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          />
        </div>

        <!-- Footer -->
        <div class="flex gap-2 px-5 py-4 border-t border-line">
          <button
            class="flex-1 py-2.5 rounded-xl border border-line text-sm font-medium text-muted
                   hover:text-ink hover:border-ink/20 transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            @click="emit('close')"
          >
            Пропустить
          </button>
          <button
            class="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold
                   hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            :disabled="!canSubmit"
            @click="onSubmit"
          >
            {{ submitting ? 'Отправляем...' : 'Отправить' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
