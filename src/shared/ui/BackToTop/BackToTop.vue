<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ChevronUp } from 'lucide-vue-next'

const props = defineProps<{ threshold?: number }>()

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > (props.threshold ?? 600)
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <Transition name="btt">
    <button
      v-if="visible"
      type="button"
      class="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-accent text-white shadow-lg
             hover:bg-accent-hover active:scale-95 transition-all
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40
             grid place-items-center"
      aria-label="Вернуться наверх"
      @click="scrollTop"
    >
      <ChevronUp :size="20" />
    </button>
  </Transition>
</template>

<style scoped>
.btt-enter-active,
.btt-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.btt-enter-from,
.btt-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
