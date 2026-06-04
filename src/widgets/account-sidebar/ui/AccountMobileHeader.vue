<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
import { ACCOUNT_NAV } from '../model/nav'

const route = useRoute()
const router = useRouter()

const title = computed(
  () => ACCOUNT_NAV.find((item) => route.path.startsWith(item.to))?.label ?? 'Профиль',
)

function goBack(): void {
  router.push('/account')
}
</script>

<template>
  <div class="flex items-center gap-2 mb-4">
    <button
      class="w-9 h-9 -ml-1.5 rounded-full flex items-center justify-center text-ink
             active:bg-surface-soft transition-colors
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      aria-label="Назад"
      @click="goBack"
    >
      <ChevronLeft :size="22" />
    </button>
    <h1 class="font-display text-xl font-bold text-ink">{{ title }}</h1>
  </div>
</template>
