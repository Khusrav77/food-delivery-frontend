<script setup lang="ts">
import { onMounted } from 'vue'
import { Plus } from 'lucide-vue-next'
import { AddressCard, AddressFormModal, useAddressManager } from '@/features/address-manager'

const {
  list, loading, isFormOpen, editingId, draft, errors, saving, serverError,
  fetchAll, openCreate, openEdit, closeForm, save, remove, setPrimary,
} = useAddressManager()

onMounted(fetchAll)
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-ink">Адреса доставки</h2>
      <button
        class="flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-semibold
               rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        @click="openCreate"
      >
        <Plus :size="15" />
        Добавить
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid sm:grid-cols-2 gap-3">
      <div v-for="i in 2" :key="i" class="h-32 bg-surface rounded-2xl border border-line animate-pulse" />
    </div>

    <!-- Empty -->
    <div
      v-else-if="list.length === 0"
      class="flex flex-col items-center gap-3 py-16 text-center"
    >
      <div class="w-14 h-14 rounded-2xl bg-canvas border border-line flex items-center justify-center text-2xl">
        📍
      </div>
      <p class="text-muted text-sm">Нет сохранённых адресов</p>
      <button
        class="text-sm text-accent font-medium hover:underline focus-visible:outline-none"
        @click="openCreate"
      >
        Добавить первый адрес
      </button>
    </div>

    <!-- List -->
    <div v-else class="grid sm:grid-cols-2 gap-3">
      <AddressCard
        v-for="addr in list"
        :key="addr.id"
        :address="addr"
        @edit="openEdit"
        @remove="remove"
        @set-primary="setPrimary"
      />
    </div>

    <!-- Modal -->
    <AddressFormModal
      v-if="isFormOpen"
      :editing-id="editingId"
      :draft="draft"
      :errors="errors"
      :saving="saving"
      :server-error="serverError"
      @save="save"
      @close="closeForm"
    />
  </div>
</template>
