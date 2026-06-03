<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useMobileTabBar } from '../model/useMobileTabBar'

const { effectiveTabs } = useMobileTabBar()
</script>

<template>
  <nav
    class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-line"
    style="padding-bottom: env(safe-area-inset-bottom)"
  >
    <div class="flex h-14">
      <RouterLink
        v-for="tab in effectiveTabs"
        :key="tab.to"
        :to="tab.resolvedTo"
        class="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors focus-visible:outline-none"
        :class="tab.active ? 'text-accent' : 'text-faint'"
        :aria-label="tab.label"
      >
        <span class="relative">
          <component :is="tab.icon" :size="22" />
          <span
            v-if="tab.badgeCount > 0"
            class="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-0.5 rounded-full
                   bg-accent text-white text-[9px] font-bold leading-none
                   flex items-center justify-center"
          >{{ tab.badgeCount > 99 ? '99+' : tab.badgeCount }}</span>
        </span>
        <span>{{ tab.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>
