<script setup lang="ts">
import { ref } from 'vue'
import { Star } from 'lucide-vue-next'

const props = defineProps<{ modelValue: number }>()
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const hovered = ref(0)
const stars = [1, 2, 3, 4, 5]

function isActive(n: number): boolean {
  return n <= (hovered.value || props.modelValue)
}
</script>

<template>
  <div class="flex items-center gap-1.5" @mouseleave="hovered = 0">
    <button
      v-for="n in stars"
      :key="n"
      type="button"
      class="p-1 rounded-lg transition-transform hover:scale-110
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      :aria-label="`Оценка ${n} из 5`"
      @mouseenter="hovered = n"
      @click="emit('update:modelValue', n)"
    >
      <Star
        :size="34"
        class="transition-colors"
        :class="isActive(n) ? 'text-amber-400 fill-amber-400' : 'text-line'"
      />
    </button>
  </div>
</template>
