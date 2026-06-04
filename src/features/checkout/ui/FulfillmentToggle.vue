<script setup lang="ts">
import { Truck, Store } from 'lucide-vue-next'
import type { FulfillmentMode } from '../model/types'

const props = defineProps<{ modelValue: FulfillmentMode }>()
const emit = defineEmits<{ 'update:modelValue': [mode: FulfillmentMode] }>()
</script>

<template>
  <div
    class="relative flex bg-surface-soft rounded-2xl p-1.5 gap-1.5 select-none"
    role="group"
    aria-label="Способ получения"
  >
    <!-- Sliding pill indicator -->
    <span
      class="absolute top-1.5 bottom-1.5 rounded-xl bg-surface shadow-sm border border-line/60
             pointer-events-none motion-reduce:transition-none"
      :style="{
        width: 'calc(50% - 6px)',
        left: props.modelValue === 'pickup' ? '50%' : '6px',
        transition: 'left 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }"
    />

    <!-- Delivery tab -->
    <button
      type="button"
      role="radio"
      :aria-checked="props.modelValue === 'delivery'"
      class="relative z-10 flex-1 flex items-center justify-center gap-2.5 h-12 rounded-xl
             text-sm font-semibold cursor-pointer transition-colors duration-150
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      :class="props.modelValue === 'delivery' ? 'text-ink' : 'text-faint hover:text-muted'"
      @click="emit('update:modelValue', 'delivery')"
    >
      <Truck
        :size="17"
        :class="props.modelValue === 'delivery' ? 'text-accent' : 'text-faint'"
        class="shrink-0 transition-colors duration-150"
      />
      Доставка
    </button>

    <!-- Pickup tab -->
    <button
      type="button"
      role="radio"
      :aria-checked="props.modelValue === 'pickup'"
      class="relative z-10 flex-1 flex items-center justify-center gap-2.5 h-12 rounded-xl
             text-sm font-semibold cursor-pointer transition-colors duration-150
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      :class="props.modelValue === 'pickup' ? 'text-ink' : 'text-faint hover:text-muted'"
      @click="emit('update:modelValue', 'pickup')"
    >
      <Store
        :size="17"
        :class="props.modelValue === 'pickup' ? 'text-accent' : 'text-faint'"
        class="shrink-0 transition-colors duration-150"
      />
      Самовывоз
    </button>
  </div>
</template>
