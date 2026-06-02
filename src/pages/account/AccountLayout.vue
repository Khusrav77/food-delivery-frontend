<script setup lang="ts">
import { RouterView } from 'vue-router'
import { AccountSidebar } from '@/widgets/account-sidebar'
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8 pb-24 md:pb-8">
    <div class="flex gap-6 items-start">
      <AccountSidebar />
      <main class="flex-1 min-w-0">
        <RouterView />
      </main>
    </div>
  </div>
</template>
