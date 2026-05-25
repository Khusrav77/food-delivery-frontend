<script setup lang="ts">
import { RouterView } from 'vue-router'
import { PublicHeader } from '@/widgets/public-header'
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <PublicHeader />
    <RouterView />
  </div>
</template>
