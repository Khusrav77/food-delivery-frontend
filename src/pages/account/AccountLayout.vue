<script setup lang="ts">
import { RouterView } from 'vue-router'
import { AccountSidebar } from '@/widgets/account-sidebar'
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-8 pb-6 md:pb-8">
    <div class="flex flex-col gap-4 md:flex-row md:gap-6 md:items-start">
      <AccountSidebar />
      <main class="flex-1 min-w-0 w-full">
        <RouterView />
      </main>
    </div>
  </div>
</template>
