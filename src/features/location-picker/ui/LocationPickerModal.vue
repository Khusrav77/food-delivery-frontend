<script setup lang="ts">
import { ref, onMounted } from 'vue'
import 'leaflet/dist/leaflet.css'
import { X, Search, Loader2, MapPin, Check, AlertTriangle } from 'lucide-vue-next'
import { CITIES } from '@/entities/delivery-location'
import { formatPrice } from '@/shared/lib/money'
import { useLocationPicker } from '../model/useLocationPicker'

const emit = defineEmits<{ close: [] }>()

const mapEl = ref<HTMLElement | null>(null)
const {
  draft, query, suggestions, searching, searchError,
  zoneChecked, zoneResult, errors, saving,
  open, selectCity, onQueryInput, pickSuggestion, save,
} = useLocationPicker(mapEl, () => emit('close'))

onMounted(open)

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-ink text-sm ' +
  'placeholder:text-faint focus-visible:outline-none focus:border-accent focus:ring-2 ' +
  'focus:ring-accent/20 transition-colors'
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 bg-ink/40 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div class="w-full sm:max-w-2xl bg-surface rounded-t-3xl sm:rounded-3xl shadow-xl border border-line max-h-[92vh] flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
          <h3 class="font-display font-semibold text-ink">Город и адрес доставки</h3>
          <button
            class="w-8 h-8 rounded-full flex items-center justify-center text-faint hover:text-ink hover:bg-surface-soft
                   transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            aria-label="Закрыть"
            @click="emit('close')"
          >
            <X :size="16" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-5 space-y-4 overflow-y-auto">
          <!-- City + Search -->
          <div class="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-3">
            <select
              :value="draft.cityId"
              :class="inputClass"
              aria-label="Город"
              @change="selectCity(($event.target as HTMLSelectElement).value)"
            >
              <option v-for="c in CITIES" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>

            <div class="relative">
              <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
              <input
                :value="query"
                type="text"
                placeholder="Поиск улицы и дома…"
                :class="[inputClass, 'pl-9']"
                @input="onQueryInput(($event.target as HTMLInputElement).value)"
              />
              <Loader2 v-if="searching" :size="15" class="absolute right-3 top-1/2 -translate-y-1/2 text-accent animate-spin" />

              <!-- Suggestions dropdown -->
              <ul
                v-if="suggestions.length"
                class="absolute z-10 mt-1.5 w-full bg-surface border border-line rounded-xl shadow-lg overflow-hidden max-h-64 overflow-y-auto"
              >
                <li v-for="s in suggestions" :key="`${s.lat},${s.lng}`">
                  <button
                    type="button"
                    class="w-full flex items-start gap-2 px-3.5 py-2.5 text-left text-sm text-ink hover:bg-surface-soft transition-colors"
                    @click="pickSuggestion(s)"
                  >
                    <MapPin :size="14" class="text-accent shrink-0 mt-0.5" />
                    <span class="leading-snug">{{ s.label }}</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <p v-if="searchError" class="text-xs text-red-500 -mt-2">{{ searchError }}</p>

          <!-- Map -->
          <div ref="mapEl" class="relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-line z-0" />
          <p class="text-xs text-faint -mt-2">Перетащите метку или кликните по карте, чтобы уточнить точку.</p>

          <!-- Address fields -->
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2 sm:col-span-1">
              <input
                v-model="draft.street"
                type="text"
                placeholder="Улица"
                :class="[inputClass, errors.street && 'border-red-400 focus:border-red-400 focus:ring-red-200']"
              />
              <p v-if="errors.street" class="text-xs text-red-500 mt-1 px-1">{{ errors.street }}</p>
            </div>
            <div class="col-span-2 sm:col-span-1">
              <input
                v-model="draft.house"
                type="text"
                placeholder="Дом"
                :class="[inputClass, errors.house && 'border-red-400 focus:border-red-400 focus:ring-red-200']"
              />
              <p v-if="errors.house" class="text-xs text-red-500 mt-1 px-1">{{ errors.house }}</p>
            </div>
            <input v-model="draft.apartment" type="text" placeholder="Квартира" :class="inputClass" />
            <input v-model="draft.entrance" type="text" placeholder="Подъезд" :class="inputClass" />
            <input v-model="draft.floor" type="text" placeholder="Этаж" :class="inputClass" />
            <input v-model="draft.comment" type="text" placeholder="Комментарий курьеру" :class="inputClass" />
          </div>

          <!-- Zone status -->
          <div
            v-if="zoneChecked && zoneResult && zoneResult.type !== 'none'"
            class="flex flex-wrap items-center gap-x-4 gap-y-1 px-3.5 py-2.5 rounded-xl bg-emerald-50 text-sm text-emerald-700"
          >
            <span class="flex items-center gap-1.5 font-medium">
              <Check :size="15" class="shrink-0" />
              {{ zoneResult.type === 'free' ? 'Бесплатная доставка' : `Доставка ${formatPrice(zoneResult.deliveryCost)}` }}
            </span>
            <span v-if="zoneResult.minOrderAmount > 0" class="text-emerald-600/80">
              Мин. заказ {{ formatPrice(zoneResult.minOrderAmount) }}
            </span>
            <span class="text-emerald-600/70">Зона «{{ zoneResult.name }}»</span>
          </div>
          <div
            v-else-if="zoneChecked"
            class="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-red-50 text-sm text-red-600"
          >
            <AlertTriangle :size="16" class="shrink-0 mt-0.5" />
            <span>Сюда пока не доставляем. Выберите точку ближе к центру города.</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex gap-2 px-5 py-4 border-t border-line shrink-0">
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
            @click="save()"
          >
            Сохранить адрес
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
