<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'
import type { OrderStatus } from '../model/types'
import { ORDER_STEPS, STATUS_META } from '../model/types'

const props = withDefaults(
  defineProps<{ status: OrderStatus; size?: 'sm' | 'lg' }>(),
  { size: 'sm' },
)

const steps = ORDER_STEPS.map((key) => ({ key, label: STATUS_META[key].label }))
const currentStep = computed(() => STATUS_META[props.status].step)
const isCancelled = computed(() => props.status === 'cancelled')
</script>

<template>
  <div class="flex items-center gap-0" :class="{ 'opacity-50 grayscale': isCancelled }">
    <template v-for="(step, i) in steps" :key="step.key">
      <div class="flex flex-col items-center gap-1 flex-1 min-w-0">
        <div
          class="rounded-full flex items-center justify-center font-bold border-2 transition-colors"
          :class="[
            size === 'lg' ? 'w-9 h-9 text-sm' : 'w-7 h-7 text-xs',
            currentStep >= i + 1
              ? 'bg-accent border-accent text-white'
              : 'bg-canvas border-line text-faint',
          ]"
        >
          <Check v-if="currentStep > i + 1" :size="size === 'lg' ? 17 : 13" />
          <span v-else>{{ i + 1 }}</span>
        </div>
        <span
          class="text-center text-faint leading-tight"
          :class="size === 'lg' ? 'text-xs' : 'text-[10px] hidden sm:block'"
        >
          {{ step.label }}
        </span>
      </div>
      <div
        v-if="i < steps.length - 1"
        class="h-0.5 flex-1 transition-colors"
        :class="[
          size === 'lg' ? 'mt-[-16px]' : 'mt-[-12px]',
          currentStep > i + 1 ? 'bg-accent' : 'bg-line',
        ]"
      />
    </template>
  </div>
</template>
