<script setup lang="ts">
import { RouterView } from 'vue-router'
import { PublicHeader } from '@/widgets/public-header'
import { PublicFooter } from '@/widgets/public-footer'
import { CartDrawer } from '@/widgets/cart-drawer'
import { ToastContainer } from '@/shared/ui/Toast'
import { useThemeStore } from '@/entities/theme'

const themeStore = useThemeStore()
themeStore.setActiveArea('client')
</script>

<template>
  <div class="min-h-screen flex flex-col bg-canvas">
    <PublicHeader />
    <div class="flex-1">
      <RouterView />
    </div>
    <PublicFooter />
    <CartDrawer />
    <ToastContainer />
  </div>
</template>
