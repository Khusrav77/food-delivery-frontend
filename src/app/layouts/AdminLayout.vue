<script setup lang="ts">
import { RouterView } from 'vue-router'
import { AdminSidebar } from '@/widgets/admin-sidebar'
import { AdminHeader } from '@/widgets/admin-header'
import { ToastContainer } from '@/shared/ui/Toast'
</script>

<template>
  <div class="flex h-screen bg-[#f1f1f1] overflow-hidden">
    <AdminSidebar />
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <AdminHeader />
      <main class="flex-1 overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>
  <ToastContainer />
</template>
