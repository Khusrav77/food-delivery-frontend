<script setup lang="ts">
import { computed } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'
import { useThemeStore } from '@/entities/theme'
import type { ThemeArea } from '@/entities/theme'

const props = defineProps<{ area: ThemeArea }>()

const store = useThemeStore()

const isDark = computed(() =>
  props.area === 'admin' ? store.adminTheme === 'dark' : store.clientTheme === 'dark',
)
</script>

<template>
  <button
    class="w-9 h-9 rounded-full border border-line-strong flex items-center justify-center text-muted hover:text-ink hover:bg-surface-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 cursor-pointer shrink-0"
    :aria-label="isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'"
    @click="store.toggle(area)"
  >
    <Sun v-if="isDark" :size="15" />
    <Moon v-else :size="15" />
  </button>
</template>
