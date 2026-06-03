<script setup lang="ts">
import { Home, Briefcase, MapPin, Star, Pencil, Trash2 } from 'lucide-vue-next'
import type { IAddress } from '@/entities/address'
import { ADDRESS_LABEL_NAMES } from '../model/addressDraft'

defineProps<{ address: IAddress; saving?: boolean }>()
const emit = defineEmits<{
  edit: [addr: IAddress]
  remove: [id: string]
  setPrimary: [id: string]
}>()

const LABEL_ICONS = { home: Home, work: Briefcase, other: MapPin }
</script>

<template>
  <div
    class="relative bg-surface rounded-2xl border p-4 transition-colors"
    :class="address.isPrimary ? 'border-accent/40' : 'border-line'"
  >
    <!-- Primary badge -->
    <span
      v-if="address.isPrimary"
      class="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-accent-soft text-accent"
    >
      <Star :size="10" class="fill-accent" />
      Основной
    </span>

    <div class="flex items-start gap-3 pr-20">
      <div class="w-9 h-9 rounded-xl bg-canvas border border-line flex items-center justify-center shrink-0">
        <component :is="LABEL_ICONS[address.label]" :size="16" class="text-muted" />
      </div>
      <div class="min-w-0">
        <p class="text-sm font-semibold text-ink">{{ ADDRESS_LABEL_NAMES[address.label] }}</p>
        <p class="text-sm text-muted mt-0.5">{{ address.street }}, д. {{ address.house }}
          <template v-if="address.apartment">, кв. {{ address.apartment }}</template>
        </p>
        <p v-if="address.comment" class="text-xs text-faint mt-0.5">{{ address.comment }}</p>
      </div>
    </div>

    <div class="flex items-center gap-2 mt-3 pt-3 border-t border-line">
      <button
        v-if="!address.isPrimary"
        class="text-xs text-muted hover:text-accent transition-colors
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded"
        @click="emit('setPrimary', address.id)"
      >
        Сделать основным
      </button>
      <div class="flex items-center gap-1 ml-auto">
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center text-faint hover:text-ink hover:bg-surface-soft
                 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          title="Редактировать"
          @click="emit('edit', address)"
        >
          <Pencil :size="14" />
        </button>
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center text-faint hover:text-red-500 hover:bg-red-50
                 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/40"
          title="Удалить"
          @click="emit('remove', address.id)"
        >
          <Trash2 :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>
