<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Plus, X, Pencil } from 'lucide-vue-next'
import {
  useAdminCourierStore,
  defaultDraft,
  validateCourierDraft,
  type IAdminCourier,
  type ICourierDraft,
} from '@/entities/courier'
import { useToastStore } from '@/shared/lib/toast'
import { formatPrice } from '@/shared/lib/money'

const router = useRouter()
const store  = useAdminCourierStore()
const toast  = useToastStore()
const { list, loadingList, listError } = storeToRefs(store)

// Modal state (shared for create + edit)
const showModal  = ref(false)
const editingId  = ref<string | null>(null)
const saving     = ref(false)
const serverErr  = ref<string | null>(null)
const draft      = reactive<ICourierDraft>(defaultDraft())
const errors     = computed(() => validateCourierDraft(draft))
const canSave    = computed(() => Object.keys(errors.value).length === 0 && !saving.value)

const onlineCount  = computed(() => list.value.filter((c) => c.isOnline).length)
const offlineCount = computed(() => list.value.filter((c) => !c.isOnline).length)

function openCreate(): void {
  editingId.value = null
  Object.assign(draft, defaultDraft())
  serverErr.value = null
  showModal.value = true
}

function openEdit(courier: IAdminCourier): void {
  editingId.value = courier.id
  draft.name  = courier.name
  draft.phone = courier.phone
  serverErr.value = null
  showModal.value = true
}

async function submitModal(): Promise<void> {
  if (!canSave.value) return
  saving.value = true
  serverErr.value = null
  try {
    if (editingId.value) {
      await store.update(editingId.value, { ...draft })
      toast.success('Профиль курьера обновлён')
    } else {
      await store.create({ ...draft })
      toast.success(`Курьер ${draft.name} добавлен`)
    }
    showModal.value = false
  } catch (e) {
    serverErr.value = (e as { message?: string }).message ?? 'Ошибка сохранения'
  } finally {
    saving.value = false
  }
}

onMounted(store.fetchAll)
</script>

<template>
  <div class="p-6 space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="font-display text-xl font-extrabold text-ink">Курьеры</h1>
        <p class="text-xs text-faint mt-0.5">
          <span class="text-emerald-600 font-medium">{{ onlineCount }} онлайн</span>
          · {{ offlineCount }} офлайн
        </p>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold
               hover:bg-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        @click="openCreate"
      >
        <Plus :size="15" />
        Добавить курьера
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loadingList" class="bg-surface rounded-2xl border border-line overflow-hidden">
      <div v-for="i in 5" :key="i" class="h-16 border-b border-line last:border-0 animate-pulse bg-canvas/50" />
    </div>

    <!-- Error -->
    <div v-else-if="listError" class="py-12 text-center text-sm text-red-500">{{ listError }}</div>

    <!-- Empty -->
    <div v-else-if="list.length === 0" class="py-20 flex flex-col items-center gap-3 text-center">
      <div class="w-14 h-14 rounded-2xl bg-canvas border border-line flex items-center justify-center">
        <Bike :size="22" class="text-faint" />
      </div>
      <p class="text-muted text-sm">Курьеров пока нет</p>
      <button class="text-sm text-accent hover:underline focus-visible:outline-none" @click="openCreate">
        Добавить первого курьера
      </button>
    </div>

    <!-- Table -->
    <div v-else class="bg-surface rounded-2xl border border-line overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-surface-soft text-left">
              <th class="px-5 py-3 text-xs font-semibold text-faint uppercase tracking-wide">Курьер</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide hidden md:table-cell">Телефон</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide">Статус</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide text-right hidden sm:table-cell">Активных</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide text-right hidden lg:table-cell">Доставок</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide text-right hidden xl:table-cell">За неделю</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide text-right hidden xl:table-cell">За месяц</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            <tr
              v-for="courier in list"
              :key="courier.id"
              class="hover:bg-surface-soft transition-colors cursor-pointer"
              @click="router.push(`/admin/couriers/${courier.id}`)"
            >
              <!-- Имя + аватар -->
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-2.5">
                  <div
                    class="w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0"
                    :class="courier.isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-canvas text-muted border border-line'"
                  >
                    {{ courier.name.split(' ').map((w) => w[0]).slice(0, 2).join('') }}
                  </div>
                  <span class="font-medium text-ink">{{ courier.name }}</span>
                </div>
              </td>

              <!-- Телефон -->
              <td class="px-4 py-3.5 hidden md:table-cell text-xs text-muted">{{ courier.phone }}</td>

              <!-- Статус -->
              <td class="px-4 py-3.5">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="courier.isOnline
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-canvas text-faint border border-line'"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="courier.isOnline ? 'bg-emerald-500' : 'bg-line'"
                  />
                  {{ courier.isOnline ? 'Онлайн' : 'Офлайн' }}
                </span>
              </td>

              <!-- Активных заказов -->
              <td class="px-4 py-3.5 text-right hidden sm:table-cell">
                <span class="text-sm font-semibold" :class="courier.activeOrdersCount > 0 ? 'text-accent' : 'text-faint'">
                  {{ courier.activeOrdersCount }}
                </span>
              </td>

              <!-- Всего доставок -->
              <td class="px-4 py-3.5 text-right hidden lg:table-cell text-sm font-semibold text-ink">
                {{ courier.totalDeliveries }}
              </td>

              <!-- Заработок неделя -->
              <td class="px-4 py-3.5 text-right hidden xl:table-cell text-sm font-semibold text-ink whitespace-nowrap">
                {{ formatPrice(courier.earnings.week) }}
              </td>

              <!-- Заработок месяц -->
              <td class="px-4 py-3.5 text-right hidden xl:table-cell text-sm font-semibold text-ink whitespace-nowrap">
                {{ formatPrice(courier.earnings.month) }}
              </td>

              <!-- Edit button -->
              <td class="px-4 py-3.5 text-right" @click.stop>
                <button
                  class="p-1.5 rounded-lg text-faint hover:text-ink hover:bg-surface-soft transition-colors
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  @click="openEdit(courier)"
                >
                  <Pencil :size="14" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Add / Edit modal -->
  <Teleport to="body">
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
      @click.self="showModal = false"
    >
      <div class="w-full max-w-sm bg-surface rounded-3xl shadow-xl border border-line">
        <div class="flex items-center justify-between px-5 py-4 border-b border-line">
          <h3 class="font-semibold text-ink">{{ editingId ? 'Редактировать курьера' : 'Добавить курьера' }}</h3>
          <button
            class="w-8 h-8 rounded-full flex items-center justify-center text-faint hover:text-ink hover:bg-surface-soft
                   transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            @click="showModal = false"
          >
            <X :size="16" />
          </button>
        </div>
        <div class="p-5 space-y-4">
          <!-- Имя -->
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-faint uppercase tracking-wide">Имя и фамилия</label>
            <input
              v-model="draft.name"
              type="text"
              placeholder="Иван Иванов"
              class="w-full rounded-xl border px-3.5 py-2.5 text-sm text-ink placeholder:text-faint
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              :class="errors.name ? 'border-red-300 bg-red-50' : 'border-line bg-canvas'"
            />
            <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
          </div>
          <!-- Телефон -->
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-faint uppercase tracking-wide">Телефон</label>
            <input
              v-model="draft.phone"
              type="text"
              placeholder="+7 (999) 000-00-00"
              class="w-full rounded-xl border px-3.5 py-2.5 text-sm text-ink placeholder:text-faint
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              :class="errors.phone ? 'border-red-300 bg-red-50' : 'border-line bg-canvas'"
            />
            <p v-if="errors.phone" class="text-xs text-red-500">{{ errors.phone }}</p>
          </div>
          <p v-if="serverErr" class="text-sm text-red-500">{{ serverErr }}</p>
        </div>
        <div class="flex gap-2 px-5 py-4 border-t border-line">
          <button
            class="flex-1 py-2.5 rounded-xl border border-line text-sm font-medium text-muted hover:text-ink hover:border-ink/20 transition-colors"
            @click="showModal = false"
          >
            Отмена
          </button>
          <button
            class="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!canSave"
            @click="submitModal"
          >
            {{ saving ? 'Сохраняем…' : (editingId ? 'Сохранить' : 'Добавить') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
