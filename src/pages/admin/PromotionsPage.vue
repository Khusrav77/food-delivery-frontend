<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Plus, X, ToggleLeft, ToggleRight, Tag, BadgePercent, DollarSign, Calendar, Users } from 'lucide-vue-next'
import {
  useAdminPromoStore,
  defaultDraft,
  validateDraft,
  type IPromoCodeDraft,
} from '@/entities/promo'
import { useToastStore } from '@/shared/lib/toast'
import { formatDate } from '@/shared/lib/date'
import { formatPrice } from '@/shared/lib/money'

const store = useAdminPromoStore()
const toast = useToastStore()
const { list, loading, error } = storeToRefs(store)

// Create modal state
const showCreate = ref(false)
const saving     = ref(false)
const draft      = reactive<IPromoCodeDraft>(defaultDraft())
const errors     = computed(() => validateDraft(draft))
const canSave    = computed(() => Object.keys(errors.value).length === 0 && !saving.value)
const serverErr  = ref<string | null>(null)

// Toggling state per promo
const toggling = ref<Set<string>>(new Set())

function openCreate(): void {
  Object.assign(draft, defaultDraft())
  serverErr.value = null
  showCreate.value = true
}

async function submitCreate(): Promise<void> {
  if (!canSave.value) return
  saving.value = true
  serverErr.value = null
  try {
    await store.create({ ...draft })
    toast.success(`Промокод ${draft.code.toUpperCase()} создан`)
    showCreate.value = false
  } catch (e) {
    serverErr.value = (e as { message?: string }).message ?? 'Ошибка создания'
  } finally {
    saving.value = false
  }
}

async function handleToggle(id: string, code: string, isActive: boolean): Promise<void> {
  toggling.value = new Set(toggling.value).add(id)
  try {
    await store.toggle(id)
    toast.info(isActive ? `Промокод ${code} деактивирован` : `Промокод ${code} активирован`)
  } catch {
    toast.error('Не удалось изменить статус')
  } finally {
    const next = new Set(toggling.value)
    next.delete(id)
    toggling.value = next
  }
}

function expiryLabel(expiresAt: string | null): { text: string; cls: string } {
  if (!expiresAt) return { text: 'Бессрочно', cls: 'text-faint' }
  const expired = new Date(expiresAt) < new Date()
  return expired
    ? { text: `Истёк ${formatDate(expiresAt)}`, cls: 'text-red-500' }
    : { text: `До ${formatDate(expiresAt)}`, cls: 'text-muted' }
}

onMounted(store.fetchAll)
</script>

<template>
  <div class="p-6 space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="font-display text-xl font-extrabold text-ink">Промокоды</h1>
        <p class="text-xs text-faint mt-0.5">{{ list.length }} промокодов</p>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold
               hover:bg-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        @click="openCreate"
      >
        <Plus :size="15" />
        Создать промокод
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-surface rounded-2xl border border-line overflow-hidden">
      <div v-for="i in 6" :key="i" class="h-14 border-b border-line last:border-0 animate-pulse bg-canvas/50" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="py-12 text-center text-sm text-red-500">{{ error }}</div>

    <!-- Empty -->
    <div v-else-if="list.length === 0" class="py-16 flex flex-col items-center gap-3 text-center">
      <div class="w-14 h-14 rounded-2xl bg-canvas border border-line flex items-center justify-center">
        <Tag :size="22" class="text-faint" />
      </div>
      <p class="text-muted text-sm">Промокодов пока нет</p>
    </div>

    <!-- Table -->
    <div v-else class="bg-surface rounded-2xl border border-line overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-surface-soft text-left">
              <th class="px-5 py-3 text-xs font-semibold text-faint uppercase tracking-wide">Код</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide">Скидка</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide hidden md:table-cell">Срок</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide text-right hidden sm:table-cell">Применений</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide text-right hidden lg:table-cell">Сумма скидок</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide">Статус</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide text-right">Действие</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            <tr v-for="promo in list" :key="promo.id" class="hover:bg-surface-soft transition-colors">
              <!-- Код + создан -->
              <td class="px-5 py-3.5">
                <span class="font-mono text-sm font-bold text-ink">{{ promo.code }}</span>
                <p class="text-[11px] text-faint mt-0.5">{{ formatDate(promo.createdAt) }}</p>
              </td>

              <!-- Скидка -->
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-1.5">
                  <component
                    :is="promo.type === 'percent' ? BadgePercent : DollarSign"
                    :size="13"
                    class="text-accent shrink-0"
                  />
                  <span class="font-semibold text-ink">
                    {{ promo.type === 'percent' ? `${promo.value}%` : formatPrice(promo.value) }}
                  </span>
                </div>
              </td>

              <!-- Срок -->
              <td class="px-4 py-3.5 hidden md:table-cell">
                <div class="flex items-center gap-1 text-xs" :class="expiryLabel(promo.expiresAt).cls">
                  <Calendar :size="12" class="shrink-0" />
                  {{ expiryLabel(promo.expiresAt).text }}
                </div>
              </td>

              <!-- Применений / лимит -->
              <td class="px-4 py-3.5 text-right hidden sm:table-cell">
                <div class="flex items-center justify-end gap-1 text-xs text-muted">
                  <Users :size="12" />
                  <span class="font-semibold text-ink">{{ promo.usageCount }}</span>
                  <span v-if="promo.usageLimit" class="text-faint">/ {{ promo.usageLimit }}</span>
                  <span v-else class="text-faint">/ ∞</span>
                </div>
              </td>

              <!-- Сумма скидок -->
              <td class="px-4 py-3.5 text-right hidden lg:table-cell">
                <span class="text-sm font-semibold text-emerald-600">
                  −{{ formatPrice(promo.totalDiscount) }}
                </span>
              </td>

              <!-- Статус -->
              <td class="px-4 py-3.5">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border"
                  :class="promo.isActive
                    ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                    : 'text-muted bg-canvas border-line'"
                >
                  {{ promo.isActive ? 'Активен' : 'Неактивен' }}
                </span>
              </td>

              <!-- Действие -->
              <td class="px-4 py-3.5 text-right">
                <button
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors disabled:opacity-50
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  :class="promo.isActive
                    ? 'border-line text-muted hover:text-red-600 hover:border-red-200 hover:bg-red-50'
                    : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'"
                  :disabled="toggling.has(promo.id)"
                  @click="handleToggle(promo.id, promo.code, promo.isActive)"
                >
                  <component :is="promo.isActive ? ToggleRight : ToggleLeft" :size="13" />
                  {{ promo.isActive ? 'Деактивировать' : 'Активировать' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Create modal -->
  <Teleport to="body">
    <div
      v-if="showCreate"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
      @click.self="showCreate = false"
    >
      <div class="w-full max-w-md bg-surface rounded-3xl shadow-xl border border-line">
        <!-- Modal header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-line">
          <h3 class="font-semibold text-ink">Новый промокод</h3>
          <button
            class="w-8 h-8 rounded-full flex items-center justify-center text-faint hover:text-ink hover:bg-surface-soft
                   transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            @click="showCreate = false"
          >
            <X :size="16" />
          </button>
        </div>

        <!-- Modal body -->
        <div class="p-5 space-y-4">
          <!-- Code -->
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-faint uppercase tracking-wide">Код промокода</label>
            <input
              v-model="draft.code"
              type="text"
              placeholder="SUMMER25"
              class="w-full rounded-xl border px-3.5 py-2.5 text-sm font-mono text-ink placeholder:text-faint uppercase
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              :class="errors.code ? 'border-red-300 bg-red-50' : 'border-line bg-canvas'"
              @input="draft.code = (draft.code as string).toUpperCase()"
            />
            <p v-if="errors.code" class="text-xs text-red-500">{{ errors.code }}</p>
          </div>

          <!-- Тип скидки -->
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-faint uppercase tracking-wide">Тип скидки</label>
            <div class="flex gap-2">
              <button
                class="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                :class="draft.type === 'percent'
                  ? 'bg-accent text-white border-accent'
                  : 'border-line text-muted hover:text-ink hover:border-ink/20'"
                @click="draft.type = 'percent'"
              >
                % Процент
              </button>
              <button
                class="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                :class="draft.type === 'fixed'
                  ? 'bg-accent text-white border-accent'
                  : 'border-line text-muted hover:text-ink hover:border-ink/20'"
                @click="draft.type = 'fixed'"
              >
                ₽ Фиксированно
              </button>
            </div>
          </div>

          <!-- Размер скидки -->
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-faint uppercase tracking-wide">
              {{ draft.type === 'percent' ? 'Процент скидки' : 'Сумма скидки (₽)' }}
            </label>
            <input
              v-model="draft.value"
              type="number"
              :placeholder="draft.type === 'percent' ? '10' : '200'"
              :min="1"
              :max="draft.type === 'percent' ? 100 : undefined"
              class="w-full rounded-xl border px-3.5 py-2.5 text-sm text-ink placeholder:text-faint
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              :class="errors.value ? 'border-red-300 bg-red-50' : 'border-line bg-canvas'"
            />
            <p v-if="errors.value" class="text-xs text-red-500">{{ errors.value }}</p>
          </div>

          <!-- Срок действия -->
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-faint uppercase tracking-wide">Срок действия (необязательно)</label>
            <input
              v-model="draft.expiresAt"
              type="date"
              class="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            />
          </div>

          <!-- Лимит использований -->
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-faint uppercase tracking-wide">Лимит использований (пусто = без лимита)</label>
            <input
              v-model="draft.usageLimit"
              type="number"
              min="1"
              placeholder="100"
              class="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink placeholder:text-faint
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            />
          </div>

          <!-- Server error -->
          <p v-if="serverErr" class="text-sm text-red-500">{{ serverErr }}</p>
        </div>

        <!-- Modal footer -->
        <div class="flex gap-2 px-5 py-4 border-t border-line">
          <button
            class="flex-1 py-2.5 rounded-xl border border-line text-sm font-medium text-muted
                   hover:text-ink hover:border-ink/20 transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            @click="showCreate = false"
          >
            Отмена
          </button>
          <button
            class="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold
                   hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            :disabled="!canSave"
            @click="submitCreate"
          >
            {{ saving ? 'Создаём…' : 'Создать' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
