<script setup lang="ts">
import { DashboardStats, RecentOrdersTable, OrderStatusBreakdown, TopRestaurants } from '@/widgets/dashboard'
</script>

<template>
  <div class="p-6 space-y-6">

    <DashboardStats />

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div class="xl:col-span-2">
        <RecentOrdersTable />
      </div>
      <div class="space-y-4">
        <OrderStatusBreakdown />
        <TopRestaurants />
      </div>
    </div>

  </div>
</template>
