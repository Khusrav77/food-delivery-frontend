<script setup lang="ts">
import { RouterView } from 'vue-router'
import { PublicHeader } from '@/widgets/public-header'
import { CartDrawer } from '@/widgets/cart-drawer'
import { ToastContainer } from '@/shared/ui/Toast'
</script>

<template>
  <div class="min-h-screen bg-canvas">
    <PublicHeader />
    <RouterView />
    <CartDrawer />
    <ToastContainer />
  </div>
</template>
