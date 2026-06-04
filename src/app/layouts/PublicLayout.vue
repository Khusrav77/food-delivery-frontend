<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import { PublicHeader } from '@/widgets/public-header'
import { PublicFooter } from '@/widgets/public-footer'
import { CartDrawer } from '@/widgets/cart-drawer'
import { MobileTabBar } from '@/widgets/mobile-tab-bar'
import { ToastContainer } from '@/shared/ui/Toast'
import { useThemeStore } from '@/entities/theme'

const themeStore = useThemeStore()
themeStore.setActiveArea('client')

const route = useRoute()
const showTabBar = computed(() => !route.path.startsWith('/checkout'))
</script>

<template>
  <div class="min-h-screen flex flex-col bg-canvas">
    <PublicHeader />
    <!-- pb on mobile reserves space above the floating tab bar (pill + 20px inset) -->
    <div class="flex-1 pb-28 md:pb-0">
      <RouterView />
    </div>
    <PublicFooter />
    <CartDrawer />
    <ToastContainer />
    <MobileTabBar v-if="showTabBar" />
  </div>
</template>
