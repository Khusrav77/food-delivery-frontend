<script setup lang="ts">
import { reactive, computed, watch, onMounted } from 'vue'
import { Gift, Save, Percent, CreditCard, ToggleLeft, ToggleRight } from 'lucide-vue-next'
import { useBonusProgramStore, validate, defaultSettings, type IBonusProgramSettings } from '@/entities/bonus-program'
import { useToastStore } from '@/shared/lib/toast'

const store = useBonusProgramStore()
const toast = useToastStore()

const draft = reactive<IBonusProgramSettings>(defaultSettings())
const errors = computed(() => validate(draft))
const canSave = computed(() => Object.keys(errors.value).length === 0 && !store.saving)

watch(() => store.settings, (s) => { if (s) Object.assign(draft, s) }, { immediate: true })

const exampleOrder = 1000
const exampleEarned = computed(() => Math.floor(exampleOrder * draft.earnRatePct / 100))
const exampleMaxRedeem = computed(() => Math.floor(exampleOrder * draft.maxRedeemPct / 100))

async function save(): Promise<void> {
  if (!canSave.value) return
  try {
    await store.save({ ...draft })
    toast.success('Настройки бонусной программы сохранены')
  } catch {
    toast.error('Не удалось сохранить настройки')
  }
}

onMounted(store.fetch)
</script>

<template>
  <div class="p-6 max-w-2xl space-y-6">
    <div>
      <h1 class="font-display text-xl font-extrabold text-ink">Бонусная программа</h1>
      <p class="text-xs text-faint mt-0.5">Настройки начисления и списания бонусных баллов</p>
    </div>

    <!-- Loading skeletons -->
    <template v-if="store.loading && !store.settings">
      <div v-for="i in 3" :key="i" class="h-32 bg-surface rounded-2xl border border-line animate-pulse" />
    </template>

    <!-- Error -->
    <div v-else-if="store.error" class="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-600">
      {{ store.error }}
      <button class="ml-3 underline text-red-700 hover:text-red-900" @click="store.fetch">
        Повторить
      </button>
    </div>

    <template v-else>
      <!-- Мастер-переключатель -->
      <section class="bg-surface rounded-2xl border border-line p-5">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-9 h-9 rounded-xl"
                 :class="draft.enabled ? 'bg-accent-soft text-accent' : 'bg-surface-soft text-faint'">
              <Gift :size="18" />
            </div>
            <div>
              <p class="text-sm font-semibold text-ink">Бонусная программа</p>
              <p class="text-xs text-faint">{{ draft.enabled ? 'Активна — клиенты копят и тратят баллы' : 'Отключена — баллы не начисляются и не принимаются' }}</p>
            </div>
          </div>
          <button
            class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            :class="draft.enabled ? 'bg-accent text-white hover:bg-accent-hover' : 'bg-surface-soft text-faint hover:bg-line hover:text-ink'"
            @click="draft.enabled = !draft.enabled"
          >
            <component :is="draft.enabled ? ToggleRight : ToggleLeft" :size="16" />
            {{ draft.enabled ? 'Включена' : 'Выключена' }}
          </button>
        </div>
      </section>

      <!-- Параметры -->
      <section
        class="bg-surface rounded-2xl border border-line p-5 space-y-5 transition-opacity"
        :class="{ 'opacity-40 pointer-events-none': !draft.enabled }"
      >
        <h2 class="text-sm font-semibold text-ink">Параметры начисления и списания</h2>

        <div class="grid sm:grid-cols-2 gap-4">
          <!-- Процент начисления -->
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-faint uppercase tracking-wide flex items-center gap-1.5">
              <Percent :size="12" /> Начисление (% от суммы заказа)
            </label>
            <div class="relative">
              <input
                v-model.number="draft.earnRatePct"
                type="number" min="0" max="100" step="1"
                class="w-full rounded-xl border bg-canvas px-3.5 py-2.5 pr-8 text-sm text-ink
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 transition-colors"
                :class="errors.earnRatePct ? 'border-red-400' : 'border-line'"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-faint select-none">%</span>
            </div>
            <p v-if="errors.earnRatePct" class="text-xs text-red-500">{{ errors.earnRatePct }}</p>
            <p v-else class="text-xs text-faint">Сколько бонусов клиент получает за каждые 100 ₽</p>
          </div>

          <!-- Максимальный % оплаты бонусами -->
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-faint uppercase tracking-wide flex items-center gap-1.5">
              <CreditCard :size="12" /> Максимум оплаты бонусами (%)
            </label>
            <div class="relative">
              <input
                v-model.number="draft.maxRedeemPct"
                type="number" min="0" max="100" step="5"
                class="w-full rounded-xl border bg-canvas px-3.5 py-2.5 pr-8 text-sm text-ink
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 transition-colors"
                :class="errors.maxRedeemPct ? 'border-red-400' : 'border-line'"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-faint select-none">%</span>
            </div>
            <p v-if="errors.maxRedeemPct" class="text-xs text-red-500">{{ errors.maxRedeemPct }}</p>
            <p v-else class="text-xs text-faint">Максимальная доля заказа, оплачиваемая бонусами</p>
          </div>
        </div>

        <!-- Живой пример -->
        <div class="rounded-xl bg-accent-soft/50 border border-accent/20 px-4 py-3.5 space-y-1">
          <p class="text-xs font-semibold text-accent uppercase tracking-wide">Пример: заказ на {{ exampleOrder }} ₽</p>
          <div class="flex gap-6 text-sm text-ink">
            <span>
              Начислено:
              <strong class="text-accent">{{ exampleEarned }} бонусов</strong>
            </span>
            <span>
              Можно списать до:
              <strong class="text-accent">{{ exampleMaxRedeem }} ₽</strong>
            </span>
          </div>
        </div>
      </section>

      <!-- Save -->
      <div class="flex justify-end">
        <button
          class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold
                 hover:bg-accent-hover transition-colors disabled:opacity-50
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          :disabled="!canSave"
          @click="save"
        >
          <Save :size="15" />
          {{ store.saving ? 'Сохраняем…' : 'Сохранить настройки' }}
        </button>
      </div>
    </template>
  </div>
</template>
