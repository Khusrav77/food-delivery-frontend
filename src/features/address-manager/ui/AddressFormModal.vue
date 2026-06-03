<script setup lang="ts">
import { X } from 'lucide-vue-next'
import type { AddressDraft, AddressDraftErrors } from '../model/addressDraft'
import { ADDRESS_LABEL_NAMES } from '../model/addressDraft'
import type { AddressLabel } from '@/entities/address'

defineProps<{
  editingId: string | null
  draft: AddressDraft
  errors: AddressDraftErrors
  saving: boolean
  serverError: string | null
}>()

const emit = defineEmits<{
  save: []
  close: []
}>()

const LABELS: AddressLabel[] = ['home', 'work', 'other']
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div class="w-full max-w-md bg-surface rounded-3xl shadow-xl border border-line">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-line">
          <h3 class="font-semibold text-ink">{{ editingId ? 'Редактировать адрес' : 'Новый адрес' }}</h3>
          <button
            class="w-8 h-8 rounded-full flex items-center justify-center text-faint hover:text-ink hover:bg-surface-soft
                   transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            @click="emit('close')"
          >
            <X :size="16" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-5 space-y-4">
          <!-- Label -->
          <div class="flex gap-2">
            <button
              v-for="lbl in LABELS"
              :key="lbl"
              class="flex-1 py-2 rounded-xl text-sm font-medium border transition-colors
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              :class="draft.label === lbl
                ? 'bg-accent text-white border-accent'
                : 'border-line text-muted hover:border-ink/20 hover:text-ink'"
              @click="draft.label = lbl"
            >
              {{ ADDRESS_LABEL_NAMES[lbl] }}
            </button>
          </div>

          <!-- Street + House -->
          <div class="grid grid-cols-3 gap-3">
            <div class="col-span-2 space-y-1">
              <label class="text-xs font-medium text-muted">Улица *</label>
              <input
                v-model="draft.street"
                type="text"
                placeholder="ул. Тверская"
                class="w-full px-3 py-2.5 rounded-xl border text-sm text-ink bg-canvas placeholder:text-faint
                       focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                :class="errors.street ? 'border-red-400' : 'border-line'"
              />
              <p v-if="errors.street" class="text-xs text-red-500">{{ errors.street }}</p>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-medium text-muted">Дом *</label>
              <input
                v-model="draft.house"
                type="text"
                placeholder="12"
                class="w-full px-3 py-2.5 rounded-xl border text-sm text-ink bg-canvas placeholder:text-faint
                       focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                :class="errors.house ? 'border-red-400' : 'border-line'"
              />
              <p v-if="errors.house" class="text-xs text-red-500">{{ errors.house }}</p>
            </div>
          </div>

          <!-- Apt / Entrance / Floor -->
          <div class="grid grid-cols-3 gap-3">
            <div class="space-y-1">
              <label class="text-xs font-medium text-muted">Квартира</label>
              <input v-model="draft.apartment" type="text" placeholder="45"
                class="w-full px-3 py-2.5 rounded-xl border border-line text-sm text-ink bg-canvas placeholder:text-faint
                       focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors" />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-medium text-muted">Подъезд</label>
              <input v-model="draft.entrance" type="text" placeholder="2"
                class="w-full px-3 py-2.5 rounded-xl border border-line text-sm text-ink bg-canvas placeholder:text-faint
                       focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors" />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-medium text-muted">Этаж</label>
              <input v-model="draft.floor" type="text" placeholder="5"
                class="w-full px-3 py-2.5 rounded-xl border border-line text-sm text-ink bg-canvas placeholder:text-faint
                       focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors" />
            </div>
          </div>

          <!-- Comment -->
          <div class="space-y-1">
            <label class="text-xs font-medium text-muted">Комментарий курьеру</label>
            <input v-model="draft.comment" type="text" placeholder="Код домофона 45#"
              class="w-full px-3 py-2.5 rounded-xl border border-line text-sm text-ink bg-canvas placeholder:text-faint
                     focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors" />
          </div>

          <p v-if="serverError" class="text-sm text-red-500">{{ serverError }}</p>
        </div>

        <!-- Footer -->
        <div class="flex gap-2 px-5 pb-5">
          <button
            class="flex-1 py-2.5 rounded-xl border border-line text-sm font-medium text-muted hover:text-ink
                   hover:bg-surface-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            @click="emit('close')"
          >
            Отмена
          </button>
          <button
            class="flex-1 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-semibold
                   transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            :disabled="saving"
            @click="emit('save')"
          >
            {{ saving ? 'Сохраняем...' : 'Сохранить' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
