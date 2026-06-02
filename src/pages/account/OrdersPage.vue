<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useOrderStore } from '@/entities/order'
import { OrderCard, OrderFilters, OrderDetailView, useOrderHistory } from '@/features/order-history'

const router = useRouter()
const orderStore = useOrderStore()
const { current, loadingCurrent } = storeToRefs(orderStore)

const { orders, loading, error, statusFilter, sortDirection, fetchAll } = useOrderHistory()

const detailId = ref<string | null>(null)

async function openDetail(id: string): Promise<void> {
  detailId.value = id
  router.replace({ query: { order: id } })
  await orderStore.fetchOne(id)
}

function closeDetail(): void {
  detailId.value = null
  router.replace({ query: {} })
}

onMounted(async () => {
  await fetchAll()
  // restore detail from URL
  const q = router.currentRoute.value.query.order
  if (typeof q === 'string') openDetail(q)
})
</script>

<template>
  <div class="space-y-4">
    <!-- Detail view -->
    <template v-if="detailId">
      <div v-if="loadingCurrent" class="space-y-3">
        <div v-for="i in 4" :key="i" class="h-20 bg-surface rounded-2xl border border-line animate-pulse" />
      </div>
      <OrderDetailView v-else-if="current" :order="current" @back="closeDetail" />
    </template>

    <!-- List view -->
    <template v-else>
      <h2 class="text-lg font-semibold text-ink">История заказов</h2>

      <OrderFilters
        v-model:status-filter="statusFilter"
        v-model:sort-direction="sortDirection"
      />

      <!-- Loading -->
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="h-36 bg-surface rounded-2xl border border-line animate-pulse" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="py-8 text-center text-sm text-red-500">{{ error }}</div>

      <!-- Empty -->
      <div
        v-else-if="orders.length === 0"
        class="flex flex-col items-center gap-3 py-16 text-center"
      >
        <div class="w-14 h-14 rounded-2xl bg-canvas border border-line flex items-center justify-center text-2xl">
          🛍️
        </div>
        <p class="text-muted text-sm">
          {{ statusFilter === 'all' ? 'Заказов пока нет' : 'Нет заказов с таким статусом' }}
        </p>
      </div>

      <!-- Cards -->
      <div v-else class="space-y-3">
        <OrderCard
          v-for="order in orders"
          :key="order.id"
          :order="order"
          @detail="openDetail"
        />
      </div>
    </template>
  </div>
</template>
