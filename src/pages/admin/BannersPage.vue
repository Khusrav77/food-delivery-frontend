<script setup lang="ts">
import { Plus, Images } from 'lucide-vue-next'
import { Sortable } from '@/shared/ui/Sortable'
import { useBannerManager, BannerCard, BannerFormModal } from '@/features/banner-manager'

const {
  ordered, showForm, draft, errors, canSave, isEditing,
  openCreate, openEdit, closeForm, save, remove, toggle, persistOrder,
} = useBannerManager()
</script>

<template>
  <div class="p-6 space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="font-display text-xl font-extrabold text-ink">Баннеры</h1>
        <p class="text-xs text-faint mt-0.5">
          {{ ordered.length }} баннеров · перетащите для изменения порядка
        </p>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold
               hover:bg-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        @click="openCreate"
      >
        <Plus :size="15" />
        Добавить баннер
      </button>
    </div>

    <!-- Empty -->
    <div
      v-if="ordered.length === 0"
      class="py-16 flex flex-col items-center gap-3 text-center"
    >
      <div class="w-14 h-14 rounded-2xl bg-canvas border border-line flex items-center justify-center">
        <Images :size="22" class="text-faint" />
      </div>
      <p class="text-muted text-sm">Баннеров пока нет</p>
      <button
        class="text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
        @click="openCreate"
      >
        Добавить первый
      </button>
    </div>

    <!-- Sortable list -->
    <Sortable
      v-else
      v-model="ordered"
      handle=".drag-handle"
      class="space-y-2.5"
      @end="persistOrder"
    >
      <template #item="{ element }">
        <BannerCard
          :banner="element"
          @edit="openEdit(element)"
          @toggle="toggle(element)"
          @remove="remove(element)"
        />
      </template>
    </Sortable>

    <!-- Form modal -->
    <BannerFormModal
      v-if="showForm"
      :draft="draft"
      :errors="errors"
      :can-save="canSave"
      :is-editing="isEditing"
      @save="save"
      @close="closeForm"
    />
  </div>
</template>
