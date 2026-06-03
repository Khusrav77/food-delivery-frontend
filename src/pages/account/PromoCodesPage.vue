<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePromoStore, PromoCard } from '@/entities/promo'

const store = usePromoStore()
const { list, loading } = storeToRefs(store)

onMounted(store.fetchAll)
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-ink">Промокоды</h2>
    </div>

    <p class="text-sm text-muted">Скопируйте код и введите его при оформлении заказа.</p>

    <!-- Loading -->
    <div v-if="loading" class="grid sm:grid-cols-2 gap-3">
      <div v-for="i in 2" :key="i" class="h-28 bg-surface rounded-2xl border border-line animate-pulse" />
    </div>

    <!-- Empty -->
    <div
      v-else-if="list.length === 0"
      class="flex flex-col items-center gap-3 py-16 text-center"
    >
      <div class="w-14 h-14 rounded-2xl bg-canvas border border-line flex items-center justify-center text-2xl">
        🎟
      </div>
      <p class="text-muted text-sm">Акций пока нет</p>
    </div>

    <!-- List -->
    <div v-else class="grid sm:grid-cols-2 gap-3">
      <PromoCard v-for="promo in list" :key="promo.id" :promo="promo" />
    </div>
  </div>
</template>
