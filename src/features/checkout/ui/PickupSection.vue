<script setup lang="ts">
import { computed } from 'vue'
import { Store, MapPin, Clock, Phone, Check, AlertTriangle } from 'lucide-vue-next'
import type { IBranch, DayOfWeek, IWorkingHours } from '@/entities/branch'
import type { DraftErrors } from '../model/checkoutDraft'

const props = defineProps<{
  branches: IBranch[]
  loading: boolean
  selectedId: string | null
  errors: DraftErrors
}>()

const emit = defineEmits<{ select: [id: string] }>()

const JS_TO_DOW: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

function todayHours(branch: IBranch): IWorkingHours {
  return branch.workingHours[JS_TO_DOW[new Date().getDay()]]
}

function isOpenNow(branch: IBranch): boolean {
  const h = todayHours(branch)
  if (!h.isOpen) return false
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const [fh, fm] = h.from.split(':').map(Number)
  const [th, tm] = h.to.split(':').map(Number)
  const toMin = th === 0 && tm === 0 ? 24 * 60 : th * 60 + tm
  return nowMin >= fh * 60 + fm && nowMin < toMin
}

function hoursLabel(branch: IBranch): string {
  const h = todayHours(branch)
  return h.isOpen ? `${h.from} – ${h.to}` : 'Сегодня закрыто'
}

const skeletons = computed(() => Array.from({ length: 3 }))
</script>

<template>
  <section class="bg-surface rounded-2xl border border-line p-5 space-y-4">
    <div class="flex items-center gap-2.5">
      <Store :size="18" class="text-accent" />
      <h3 class="font-display font-semibold text-ink text-base leading-none">Точка самовывоза</h3>
    </div>

    <!-- Loading skeletons -->
    <div v-if="loading" class="space-y-3">
      <div
        v-for="i in skeletons"
        :key="i as number"
        class="h-[76px] rounded-xl bg-surface-soft animate-pulse"
      />
    </div>

    <!-- Branch list -->
    <div v-else-if="branches.length" class="space-y-2.5">
      <button
        v-for="branch in branches"
        :key="branch.id"
        type="button"
        class="w-full text-left flex items-start gap-3.5 px-4 py-3.5 rounded-xl border transition-all
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        :class="
          selectedId === branch.id
            ? 'border-accent bg-accent-soft'
            : 'border-line hover:border-accent/40 hover:bg-surface-soft'
        "
        @click="emit('select', branch.id)"
      >
        <!-- Radio indicator -->
        <div
          class="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
          :class="selectedId === branch.id ? 'border-accent bg-accent' : 'border-line'"
        >
          <Check v-if="selectedId === branch.id" :size="11" class="text-white" :stroke-width="3" />
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0 space-y-1.5">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <p class="font-semibold text-ink text-[15px] leading-none">{{ branch.name }}</p>
            <span
              class="text-[11px] font-semibold px-2 py-0.5 rounded-full leading-none shrink-0"
              :class="isOpenNow(branch)
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'bg-surface-soft text-faint'"
            >
              {{ isOpenNow(branch) ? 'Открыто' : 'Закрыто' }}
            </span>
          </div>

          <p class="flex items-center gap-1.5 text-sm text-muted">
            <MapPin :size="13" class="text-faint shrink-0" />
            <span class="truncate">{{ branch.address }}</span>
          </p>

          <div class="flex flex-wrap gap-x-4 gap-y-1">
            <p class="flex items-center gap-1.5 text-xs text-faint">
              <Clock :size="12" class="shrink-0" />
              {{ hoursLabel(branch) }}
            </p>
            <p class="flex items-center gap-1.5 text-xs text-faint">
              <Phone :size="12" class="shrink-0" />
              {{ branch.phone }}
            </p>
          </div>
        </div>
      </button>

      <!-- Validation error -->
      <div
        v-if="errors.pickupBranch"
        class="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/20 text-sm text-red-600"
      >
        <AlertTriangle :size="15" class="shrink-0" />
        {{ errors.pickupBranch }}
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="py-8 text-center text-faint text-sm">
      Нет доступных точек самовывоза
    </div>
  </section>
</template>
