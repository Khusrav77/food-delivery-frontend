<script setup lang="ts">
import { MapPin, Plus, Check, Loader2, AlertTriangle } from 'lucide-vue-next'
import type { IAddress, AddressLabel } from '@/entities/address'
import type { CheckoutDraft, ZoneInfo } from '../model/types'
import type { DraftErrors } from '../model/checkoutDraft'
import { formatPrice } from '@/shared/lib/money'

const props = defineProps<{
  draft: CheckoutDraft
  savedAddresses: IAddress[]
  loading: boolean
  zone: ZoneInfo | null
  zoneLoading: boolean
  errors: DraftErrors
}>()

const emit = defineEmits<{
  selectSaved: [id: string]
  useNew: []
}>()

const LABELS: Record<AddressLabel, string> = { home: 'Дом', work: 'Работа', other: 'Другое' }

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-surface border border-line text-ink text-sm ' +
  'placeholder:text-faint focus-visible:outline-none focus:border-accent focus:ring-2 ' +
  'focus:ring-accent/20 transition-colors'

function shortAddress(a: IAddress): string {
  return `${a.street}, д. ${a.house}${a.apartment ? `, кв. ${a.apartment}` : ''}`
}
</script>

<template>
  <section class="bg-surface rounded-2xl border border-line p-5 space-y-4">
    <div class="flex items-center gap-2.5">
      <MapPin :size="18" class="text-accent" />
      <h3 class="font-display font-semibold text-ink text-base leading-none">Адрес доставки</h3>
    </div>

    <!-- Saved addresses -->
    <div v-if="loading" class="h-10 rounded-xl bg-surface-soft animate-pulse" />
    <div v-else-if="savedAddresses.length" class="flex flex-wrap gap-2">
      <button
        v-for="a in savedAddresses"
        :key="a.id"
        type="button"
        class="flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm transition-colors
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        :class="
          props.draft.savedAddressId === a.id
            ? 'border-accent bg-accent-soft text-ink'
            : 'border-line text-muted hover:text-ink hover:border-accent/50'
        "
        @click="emit('selectSaved', a.id)"
      >
        <Check v-if="props.draft.savedAddressId === a.id" :size="14" class="text-accent shrink-0" />
        <span class="font-medium">{{ LABELS[a.label] }}</span>
        <span class="text-faint">·</span>
        <span class="truncate max-w-[160px]">{{ shortAddress(a) }}</span>
      </button>

      <button
        type="button"
        class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm transition-colors
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        :class="
          props.draft.savedAddressId === null
            ? 'border-accent bg-accent-soft text-ink'
            : 'border-dashed border-line text-muted hover:text-ink hover:border-accent/50'
        "
        @click="emit('useNew')"
      >
        <Plus :size="14" />
        Новый
      </button>
    </div>

    <!-- Address form -->
    <div class="grid grid-cols-2 gap-3">
      <div class="col-span-2 sm:col-span-1">
        <input
          v-model="props.draft.street"
          type="text"
          placeholder="Улица"
          :class="[inputClass, props.errors.street && 'border-red-400 focus:border-red-400 focus:ring-red-200']"
        />
        <p v-if="props.errors.street" class="text-xs text-red-500 mt-1 px-1">{{ props.errors.street }}</p>
      </div>
      <div class="col-span-2 sm:col-span-1">
        <input
          v-model="props.draft.house"
          type="text"
          placeholder="Дом"
          :class="[inputClass, props.errors.house && 'border-red-400 focus:border-red-400 focus:ring-red-200']"
        />
        <p v-if="props.errors.house" class="text-xs text-red-500 mt-1 px-1">{{ props.errors.house }}</p>
      </div>
      <input v-model="props.draft.apartment" type="text" placeholder="Квартира" :class="inputClass" />
      <input v-model="props.draft.entrance" type="text" placeholder="Подъезд" :class="inputClass" />
      <input v-model="props.draft.floor" type="text" placeholder="Этаж" :class="inputClass" />
      <input
        v-model="props.draft.addressComment"
        type="text"
        placeholder="Комментарий курьеру"
        :class="[inputClass, 'col-span-2 sm:col-span-1']"
      />
    </div>

    <!-- Zone status -->
    <div
      v-if="zoneLoading"
      class="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-soft text-sm text-muted"
    >
      <Loader2 :size="15" class="animate-spin text-accent" />
      Определяем зону доставки…
    </div>
    <div
      v-else-if="zone?.type === 'none'"
      class="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-red-50 text-sm text-red-600"
    >
      <AlertTriangle :size="16" class="shrink-0 mt-0.5" />
      <span>Доставка в ваш район недоступна. Попробуйте другой адрес.</span>
    </div>
    <div
      v-else-if="zone"
      class="flex flex-wrap items-center gap-x-4 gap-y-1 px-3.5 py-2.5 rounded-xl bg-emerald-50 text-sm text-emerald-700"
    >
      <span class="font-medium">
        {{ zone.type === 'free' ? 'Бесплатная доставка' : `Доставка ${formatPrice(zone.deliveryCost)}` }}
      </span>
      <span class="text-emerald-600/80">Мин. заказ {{ formatPrice(zone.minOrder) }}</span>
      <span class="text-emerald-600/80">~{{ zone.etaMinutes }} мин</span>
    </div>
  </section>
</template>
