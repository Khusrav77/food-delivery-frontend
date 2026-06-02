<script setup lang="ts">
import { reactive, watch, onMounted } from 'vue'
import { Phone, MapPin, Instagram, Send, Save, Clock, ShoppingCart, Truck } from 'lucide-vue-next'
import { useRestaurantSettingsStore, DAY_LABELS, DAYS, type IRestaurantSettings } from '@/entities/restaurant-settings'
import { useToastStore } from '@/shared/lib/toast'

const store = useRestaurantSettingsStore()
const toast = useToastStore()

const draft = reactive<IRestaurantSettings>({
  name: '', phone: '', address: '',
  socialLinks: { instagram: '', vk: '', telegram: '' },
  minOrderAmount: 600, defaultEtaMinutes: 45,
  workingHours: {
    mon: { isOpen: true, from: '10:00', to: '23:00' },
    tue: { isOpen: true, from: '10:00', to: '23:00' },
    wed: { isOpen: true, from: '10:00', to: '23:00' },
    thu: { isOpen: true, from: '10:00', to: '23:00' },
    fri: { isOpen: true, from: '10:00', to: '00:00' },
    sat: { isOpen: true, from: '11:00', to: '00:00' },
    sun: { isOpen: true, from: '11:00', to: '22:00' },
  },
})

watch(() => store.settings, (s) => {
  if (s) Object.assign(draft, JSON.parse(JSON.stringify(s)))
}, { immediate: true })

async function save(): Promise<void> {
  try {
    await store.save(JSON.parse(JSON.stringify(draft)))
    toast.success('Настройки сохранены')
  } catch {
    toast.error('Не удалось сохранить настройки')
  }
}

onMounted(store.fetch)
</script>

<template>
  <div class="p-6 max-w-2xl space-y-6">
    <div>
      <h1 class="font-display text-xl font-extrabold text-ink">Настройки ресторана</h1>
      <p class="text-xs text-faint mt-0.5">Часы работы, контакты, параметры доставки</p>
    </div>

    <template v-if="store.loading && !store.settings">
      <div v-for="i in 3" :key="i" class="h-40 bg-surface rounded-2xl border border-line animate-pulse" />
    </template>

    <div v-else-if="store.error" class="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-600">
      {{ store.error }}
      <button class="ml-3 underline text-red-700 hover:text-red-900 focus-visible:outline-none" @click="store.fetch">
        Повторить
      </button>
    </div>

    <template v-else>
      <!-- Контактные данные -->
      <section class="bg-surface rounded-2xl border border-line p-5 space-y-4">
        <h2 class="text-sm font-semibold text-ink">Контактные данные</h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="sm:col-span-2 space-y-1.5">
            <label class="text-xs font-semibold text-faint uppercase tracking-wide">Название</label>
            <input v-model="draft.name" type="text"
              class="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-faint uppercase tracking-wide flex items-center gap-1.5">
              <Phone :size="12" /> Телефон
            </label>
            <input v-model="draft.phone" type="text"
              class="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-faint uppercase tracking-wide flex items-center gap-1.5">
              <MapPin :size="12" /> Адрес
            </label>
            <input v-model="draft.address" type="text"
              class="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-faint uppercase tracking-wide flex items-center gap-1.5">
              <Instagram :size="12" /> Instagram
            </label>
            <div class="flex items-center rounded-xl border border-line bg-canvas overflow-hidden focus-within:ring-2 focus-within:ring-accent/40">
              <span class="px-3 text-sm text-faint select-none">@</span>
              <input v-model="draft.socialLinks.instagram" type="text" placeholder="username"
                class="flex-1 py-2.5 pr-3.5 text-sm text-ink bg-transparent outline-none" />
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-faint uppercase tracking-wide">VK</label>
            <div class="flex items-center rounded-xl border border-line bg-canvas overflow-hidden focus-within:ring-2 focus-within:ring-accent/40">
              <span class="px-3 text-sm text-faint select-none whitespace-nowrap">vk.com/</span>
              <input v-model="draft.socialLinks.vk" type="text" placeholder="group"
                class="flex-1 py-2.5 pr-3.5 text-sm text-ink bg-transparent outline-none" />
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-faint uppercase tracking-wide flex items-center gap-1.5">
              <Send :size="12" /> Telegram
            </label>
            <div class="flex items-center rounded-xl border border-line bg-canvas overflow-hidden focus-within:ring-2 focus-within:ring-accent/40">
              <span class="px-3 text-sm text-faint select-none">@</span>
              <input v-model="draft.socialLinks.telegram" type="text" placeholder="channel"
                class="flex-1 py-2.5 pr-3.5 text-sm text-ink bg-transparent outline-none" />
            </div>
          </div>
        </div>
      </section>

      <!-- Параметры доставки -->
      <section class="bg-surface rounded-2xl border border-line p-5 space-y-4">
        <h2 class="text-sm font-semibold text-ink">Параметры доставки</h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-faint uppercase tracking-wide flex items-center gap-1.5">
              <ShoppingCart :size="12" /> Минимальная сумма заказа (₽)
            </label>
            <input v-model.number="draft.minOrderAmount" type="number" min="0" step="50"
              class="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-faint uppercase tracking-wide flex items-center gap-1.5">
              <Truck :size="12" /> Среднее время доставки (мин)
            </label>
            <input v-model.number="draft.defaultEtaMinutes" type="number" min="5" step="5"
              class="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" />
          </div>
        </div>
      </section>

      <!-- Часы работы -->
      <section class="bg-surface rounded-2xl border border-line p-5 space-y-4">
        <h2 class="text-sm font-semibold text-ink flex items-center gap-2">
          <Clock :size="15" class="text-faint" /> Часы работы
        </h2>
        <div class="space-y-2">
          <div
            v-for="day in DAYS" :key="day"
            class="flex items-center gap-3 py-2.5 px-3 rounded-xl border transition-colors"
            :class="draft.workingHours[day].isOpen ? 'border-line bg-canvas' : 'border-line bg-surface-soft'"
          >
            <!-- Toggle -->
            <button
              class="relative w-9 h-5 rounded-full transition-colors shrink-0
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              :class="draft.workingHours[day].isOpen ? 'bg-accent' : 'bg-line'"
              @click="draft.workingHours[day].isOpen = !draft.workingHours[day].isOpen"
            >
              <span
                class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                :class="draft.workingHours[day].isOpen ? 'translate-x-4' : 'translate-x-0.5'"
              />
            </button>
            <span class="text-sm font-medium w-28 shrink-0"
                  :class="draft.workingHours[day].isOpen ? 'text-ink' : 'text-faint'">
              {{ DAY_LABELS[day] }}
            </span>
            <template v-if="draft.workingHours[day].isOpen">
              <div class="flex items-center gap-2 ml-auto">
                <input v-model="draft.workingHours[day].from" type="time"
                  class="rounded-lg border border-line bg-surface px-2 py-1 text-sm text-ink
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" />
                <span class="text-faint text-sm">—</span>
                <input v-model="draft.workingHours[day].to" type="time"
                  class="rounded-lg border border-line bg-surface px-2 py-1 text-sm text-ink
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" />
              </div>
            </template>
            <span v-else class="ml-auto text-sm text-faint">Выходной</span>
          </div>
        </div>
      </section>

      <!-- Save -->
      <div class="flex justify-end">
        <button
          class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold
                 hover:bg-accent-hover transition-colors disabled:opacity-50
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          :disabled="store.saving"
          @click="save"
        >
          <Save :size="15" />
          {{ store.saving ? 'Сохраняем…' : 'Сохранить настройки' }}
        </button>
      </div>
    </template>
  </div>
</template>
