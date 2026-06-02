<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useOrderTracking, OrderTrackingView } from '@/features/order-tracking'
import { RatingModal } from '@/features/order-rating'

const route = useRoute()
const orderId = route.params.id as string

const ratingOpen = ref(false)
const { order, loading, error, cancellable, cancelling, load, cancel } = useOrderTracking(orderId, {
  onDelivered: () => { ratingOpen.value = true },
})

onMounted(load)
</script>

<template>
  <main class="max-w-2xl mx-auto px-4 pt-6 pb-20">
    <!-- Loading -->
    <div v-if="loading && !order" class="space-y-4">
      <div class="h-44 bg-surface rounded-2xl border border-line animate-pulse" />
      <div class="h-32 bg-surface rounded-2xl border border-line animate-pulse" />
      <div class="h-32 bg-surface rounded-2xl border border-line animate-pulse" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-20 space-y-4">
      <p class="text-muted text-sm">{{ error }}</p>
      <RouterLink
        to="/"
        class="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold
               hover:bg-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        Вернуться в меню
      </RouterLink>
    </div>

    <!-- Success -->
    <OrderTrackingView
      v-else-if="order"
      :order="order"
      :cancellable="cancellable"
      :cancelling="cancelling"
      @cancel="cancel"
    />

    <RatingModal
      v-if="order"
      :open="ratingOpen"
      :order-id="order.id"
      :order-number="order.number"
      @close="ratingOpen = false"
      @submitted="ratingOpen = false"
    />
  </main>
</template>
