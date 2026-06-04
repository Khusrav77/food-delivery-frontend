<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useMobileTabBar } from '../model/useMobileTabBar'

const { effectiveTabs } = useMobileTabBar()
</script>

<template>
  <!-- Floating pill: 20px inset from screen edges (px-5 / bottom offset) -->
  <nav
    class="md:hidden fixed inset-x-0 bottom-0 z-40 px-5 pointer-events-none"
    style="padding-bottom: max(1.25rem, env(safe-area-inset-bottom))"
  >
    <div
      class="pointer-events-auto mx-auto max-w-md flex items-center justify-around h-16 px-2
             rounded-full bg-surface/95 backdrop-blur-md border border-line
             shadow-[0_10px_30px_-6px_rgba(0,0,0,0.18)]"
    >
      <RouterLink
        v-for="tab in effectiveTabs"
        :key="tab.to"
        :to="tab.to"
        class="relative flex items-center justify-center w-12 h-12 rounded-full transition-colors
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        :class="tab.active ? 'text-accent' : 'text-faint hover:text-muted'"
        :aria-label="tab.label"
      >
        <!-- Active pill highlight -->
        <span
          class="absolute inset-1 rounded-full bg-accent-soft transition-opacity duration-200"
          :class="tab.active ? 'opacity-100' : 'opacity-0'"
        />
        <span
          class="relative"
          :data-fly-cart-target="tab.badge === 'cart' ? '' : undefined"
        >
          <component :is="tab.icon" :size="23" />
          <span
            v-if="tab.badgeCount > 0"
            class="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-0.5 rounded-full
                   bg-accent text-white text-[9px] font-bold leading-none
                   flex items-center justify-center"
          >{{ tab.badgeCount > 99 ? '99+' : tab.badgeCount }}</span>
        </span>
      </RouterLink>
    </div>
  </nav>
</template>
