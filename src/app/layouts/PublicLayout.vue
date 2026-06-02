<script setup lang="ts">
import { RouterView } from 'vue-router'
import { PublicHeader } from '@/widgets/public-header'
import { CartDrawer } from '@/widgets/cart-drawer'
</script>

<template>
  <div class="min-h-screen bg-canvas">
    <PublicHeader />
    <RouterView />
    <CartDrawer />
  </div>
</template>
