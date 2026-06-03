<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Plus, X, Pencil, Trash2, Store, Phone, MapPin, ToggleLeft, ToggleRight } from 'lucide-vue-next'
import {
  useAdminBranchStore, defaultDraft, branchToDraft, validate,
  DAYS, DAY_LABELS,
  type IBranch, type IBranchDraft,
} from '@/entities/branch'
import { useToastStore } from '@/shared/lib/toast'

const store = useAdminBranchStore()
const toast = useToastStore()
const { list, loading, error } = storeToRefs(store)

// Modal
const showModal  = ref(false)
const editingId  = ref<string | null>(null)
const saving     = ref(false)
const serverErr  = ref<string | null>(null)
const draft      = reactive<IBranchDraft>(defaultDraft())
const errors     = computed(() => validate(draft))
const canSave    = computed(() => Object.keys(errors.value).length === 0 && !saving.value)
const isEditing  = computed(() => editingId.value !== null)

function openCreate(): void {
  Object.assign(draft, defaultDraft())
  editingId.value = null
  serverErr.value = null
  showModal.value = true
}

function openEdit(branch: IBranch): void {
  Object.assign(draft, branchToDraft(branch))
  editingId.value = branch.id
  serverErr.value = null
  showModal.value = true
}

async function submitModal(): Promise<void> {
  if (!canSave.value) return
  saving.value = true
  serverErr.value = null
  try {
    if (isEditing.value) {
      await store.update(editingId.value!, { ...draft, workingHours: JSON.parse(JSON.stringify(draft.workingHours)) })
      toast.success(`Точка «${draft.name}» обновлена`)
    } else {
      await store.create({ ...draft, workingHours: JSON.parse(JSON.stringify(draft.workingHours)) })
      toast.success(`Точка «${draft.name}» добавлена`)
    }
    showModal.value = false
  } catch (e) {
    serverErr.value = (e as { message?: string }).message ?? 'Ошибка сохранения'
  } finally {
    saving.value = false
  }
}

// Toggle
const toggling = ref<Set<string>>(new Set())

async function handleToggle(branch: IBranch): Promise<void> {
  toggling.value = new Set(toggling.value).add(branch.id)
  try {
    await store.toggle(branch.id)
    toast.info(branch.isActive ? `«${branch.name}» закрыта` : `«${branch.name}» открыта`)
  } catch {
    toast.error('Не удалось изменить статус')
  } finally {
    const next = new Set(toggling.value)
    next.delete(branch.id)
    toggling.value = next
  }
}

// Delete
const deletingId = ref<string | null>(null)

async function handleDelete(branch: IBranch): Promise<void> {
  deletingId.value = branch.id
  try {
    await store.remove(branch.id)
    toast.success(`Точка «${branch.name}» удалена`)
  } catch {
    toast.error('Не удалось удалить точку')
  } finally {
    deletingId.value = null
  }
}

onMounted(store.fetchAll)
</script>

<template>
  <div class="p-6 space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="font-display text-xl font-extrabold text-ink">Точки сети</h1>
        <p class="text-xs text-faint mt-0.5">
          {{ list.length }} {{ list.length === 1 ? 'точка' : list.length < 5 ? 'точки' : 'точек' }}
        </p>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold
               hover:bg-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        @click="openCreate"
      >
        <Plus :size="15" />
        Добавить точку
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-surface rounded-2xl border border-line overflow-hidden">
      <div v-for="i in 3" :key="i" class="h-16 border-b border-line last:border-0 animate-pulse bg-canvas/50" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="py-12 text-center text-sm text-red-500">{{ error }}</div>

    <!-- Empty -->
    <div v-else-if="list.length === 0" class="py-20 flex flex-col items-center gap-3 text-center">
      <div class="w-14 h-14 rounded-2xl bg-canvas border border-line flex items-center justify-center">
        <Store :size="22" class="text-faint" />
      </div>
      <p class="text-muted text-sm">Точек пока нет</p>
      <button
        class="text-sm text-accent hover:underline focus-visible:outline-none"
        @click="openCreate"
      >
        Добавить первую точку
      </button>
    </div>

    <!-- Table -->
    <div v-else class="bg-surface rounded-2xl border border-line overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-surface-soft text-left">
              <th class="px-5 py-3 text-xs font-semibold text-faint uppercase tracking-wide">Точка</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide hidden sm:table-cell">Телефон</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide">Статус</th>
              <th class="px-4 py-3 text-xs font-semibold text-faint uppercase tracking-wide text-right">Действия</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            <tr
              v-for="branch in list" :key="branch.id"
              class="hover:bg-surface-soft transition-colors"
            >
              <!-- Название + адрес -->
              <td class="px-5 py-3.5">
                <p class="font-semibold text-ink">{{ branch.name }}</p>
                <p class="text-xs text-faint mt-0.5 flex items-center gap-1">
                  <MapPin :size="10" class="shrink-0" />
                  {{ branch.address }}
                </p>
              </td>

              <!-- Телефон -->
              <td class="px-4 py-3.5 hidden sm:table-cell">
                <span class="flex items-center gap-1.5 text-muted text-xs">
                  <Phone :size="12" class="shrink-0" />
                  {{ branch.phone }}
                </span>
              </td>

              <!-- Статус -->
              <td class="px-4 py-3.5">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border"
                  :class="branch.isActive
                    ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                    : 'text-muted bg-canvas border-line'"
                >
                  {{ branch.isActive ? 'Открыта' : 'Закрыта' }}
                </span>
              </td>

              <!-- Действия -->
              <td class="px-4 py-3.5">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    class="p-1.5 rounded-lg text-faint hover:text-ink hover:bg-surface-soft transition-colors
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    title="Редактировать"
                    @click="openEdit(branch)"
                  >
                    <Pencil :size="14" />
                  </button>

                  <button
                    class="p-1.5 rounded-lg transition-colors disabled:opacity-40
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    :class="branch.isActive
                      ? 'text-faint hover:text-orange-500 hover:bg-orange-50'
                      : 'text-faint hover:text-emerald-600 hover:bg-emerald-50'"
                    :disabled="toggling.has(branch.id)"
                    :title="branch.isActive ? 'Закрыть' : 'Открыть'"
                    @click="handleToggle(branch)"
                  >
                    <component :is="branch.isActive ? ToggleRight : ToggleLeft" :size="14" />
                  </button>

                  <button
                    class="p-1.5 rounded-lg text-faint hover:text-red-500 hover:bg-red-50 transition-colors
                           disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                    :disabled="deletingId === branch.id"
                    title="Удалить"
                    @click="handleDelete(branch)"
                  >
                    <Trash2 :size="14" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Create / Edit modal -->
  <Teleport to="body">
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
      @click.self="showModal = false"
    >
      <div class="w-full max-w-lg bg-surface rounded-3xl shadow-xl border border-line flex flex-col max-h-[90vh]">
        <!-- Modal header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
          <h3 class="font-semibold text-ink">
            {{ isEditing ? `Редактировать — ${draft.name || 'точка'}` : 'Новая точка сети' }}
          </h3>
          <button
            class="w-8 h-8 rounded-full flex items-center justify-center text-faint hover:text-ink hover:bg-surface-soft
                   transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            @click="showModal = false"
          >
            <X :size="16" />
          </button>
        </div>

        <!-- Modal body (scrollable) -->
        <div class="flex-1 overflow-y-auto p-5 space-y-5">
          <!-- Название -->
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-faint uppercase tracking-wide">Название точки</label>
            <input
              v-model="draft.name"
              type="text"
              placeholder="Арбат"
              class="w-full rounded-xl border px-3.5 py-2.5 text-sm text-ink placeholder:text-faint
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              :class="errors.name ? 'border-red-300 bg-red-50' : 'border-line bg-canvas'"
            />
            <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
          </div>

          <!-- Адрес -->
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-faint uppercase tracking-wide flex items-center gap-1.5">
              <MapPin :size="11" /> Адрес
            </label>
            <input
              v-model="draft.address"
              type="text"
              placeholder="ул. Арбат, д. 1, Москва"
              class="w-full rounded-xl border px-3.5 py-2.5 text-sm text-ink placeholder:text-faint
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              :class="errors.address ? 'border-red-300 bg-red-50' : 'border-line bg-canvas'"
            />
            <p v-if="errors.address" class="text-xs text-red-500">{{ errors.address }}</p>
          </div>

          <!-- Телефон -->
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-faint uppercase tracking-wide flex items-center gap-1.5">
              <Phone :size="11" /> Телефон
            </label>
            <input
              v-model="draft.phone"
              type="tel"
              placeholder="+7 (495) 123-45-67"
              class="w-full rounded-xl border px-3.5 py-2.5 text-sm text-ink placeholder:text-faint
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              :class="errors.phone ? 'border-red-300 bg-red-50' : 'border-line bg-canvas'"
            />
            <p v-if="errors.phone" class="text-xs text-red-500">{{ errors.phone }}</p>
          </div>

          <!-- Часы работы -->
          <div class="space-y-2">
            <p class="text-xs font-semibold text-faint uppercase tracking-wide">Часы работы</p>
            <div class="space-y-1.5">
              <div
                v-for="day in DAYS" :key="day"
                class="flex items-center gap-2.5 py-2 px-3 rounded-xl border transition-colors"
                :class="draft.workingHours[day].isOpen ? 'border-line bg-canvas' : 'border-line bg-surface-soft'"
              >
                <!-- Toggle -->
                <button
                  class="relative w-8 h-[18px] rounded-full transition-colors shrink-0
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  :class="draft.workingHours[day].isOpen ? 'bg-accent' : 'bg-line'"
                  type="button"
                  @click="draft.workingHours[day].isOpen = !draft.workingHours[day].isOpen"
                >
                  <span
                    class="absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform"
                    :class="draft.workingHours[day].isOpen ? 'translate-x-3.5' : 'translate-x-0.5'"
                  />
                </button>

                <span
                  class="text-sm font-medium w-7 shrink-0"
                  :class="draft.workingHours[day].isOpen ? 'text-ink' : 'text-faint'"
                >
                  {{ DAY_LABELS[day] }}
                </span>

                <template v-if="draft.workingHours[day].isOpen">
                  <div class="flex items-center gap-1.5 ml-auto">
                    <input
                      v-model="draft.workingHours[day].from"
                      type="time"
                      class="rounded-lg border border-line bg-surface px-2 py-1 text-xs text-ink
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    />
                    <span class="text-faint text-xs">—</span>
                    <input
                      v-model="draft.workingHours[day].to"
                      type="time"
                      class="rounded-lg border border-line bg-surface px-2 py-1 text-xs text-ink
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    />
                  </div>
                </template>
                <span v-else class="ml-auto text-xs text-faint">Выходной</span>
              </div>
            </div>
          </div>

          <p v-if="serverErr" class="text-sm text-red-500">{{ serverErr }}</p>
        </div>

        <!-- Modal footer -->
        <div class="flex gap-2 px-5 py-4 border-t border-line shrink-0">
          <button
            class="flex-1 py-2.5 rounded-xl border border-line text-sm font-medium text-muted
                   hover:text-ink hover:border-ink/20 transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            @click="showModal = false"
          >
            Отмена
          </button>
          <button
            class="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold
                   hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            :disabled="!canSave"
            @click="submitModal"
          >
            {{ saving
              ? (isEditing ? 'Сохраняем…' : 'Добавляем…')
              : (isEditing ? 'Сохранить' : 'Добавить') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
