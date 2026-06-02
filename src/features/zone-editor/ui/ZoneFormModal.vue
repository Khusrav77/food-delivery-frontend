<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { ZONE_TYPE_META } from '@/entities/delivery-zone'
import type { IDeliveryZone, IZoneDraft, ZoneType } from '@/entities/delivery-zone'
import { defaultDraft, zoneToDraft, validateZoneDraft } from '../model/zoneGeometry'

const props = defineProps<{
  visible: boolean
  zone: IDeliveryZone | null       // null = create mode
  pendingPolygon: unknown | null   // truthy check only — just signals create mode
}>()

const emit = defineEmits<{
  close: []
  save: [draft: IZoneDraft]
}>()

const draft = reactive<IZoneDraft>(defaultDraft())
const saving = defineModel<boolean>('saving', { default: false })

const errors  = computed(() => validateZoneDraft(draft))
const canSave = computed(() => Object.keys(errors.value).length === 0 && !saving.value)
const isEdit  = computed(() => props.zone !== null)

const ZONE_TYPES: ZoneType[] = ['free', 'paid', 'none']

watch(
  () => props.visible,
  (open) => {
    if (!open) return
    const src = props.zone ? zoneToDraft(props.zone) : defaultDraft()
    Object.assign(draft, src)
  },
  { immediate: true },
)

function submit(): void {
  if (!canSave.value) return
  emit('save', { ...draft })
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 translate-y-4 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
        >
          <div
            v-if="visible"
            class="w-full max-w-md bg-surface rounded-3xl shadow-xl border border-line"
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-5 py-4 border-b border-line">
              <h3 class="font-semibold text-ink">
                {{ isEdit ? 'Редактировать зону' : 'Создать зону доставки' }}
              </h3>
              <button
                class="w-8 h-8 rounded-full flex items-center justify-center text-faint
                       hover:text-ink hover:bg-surface-soft transition-colors
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                @click="emit('close')"
              >
                <X :size="16" />
              </button>
            </div>

            <!-- Body -->
            <div class="p-5 space-y-5">

              <!-- Name -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-faint uppercase tracking-wide">
                  Название зоны
                </label>
                <input
                  v-model="draft.name"
                  type="text"
                  placeholder="Центр, Север, Промзона…"
                  class="w-full rounded-xl border px-3.5 py-2.5 text-sm text-ink placeholder:text-faint
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  :class="errors.name ? 'border-red-300 bg-red-50' : 'border-line bg-canvas'"
                />
                <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
              </div>

              <!-- Zone type selector -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-faint uppercase tracking-wide">
                  Тип зоны
                </label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="type in ZONE_TYPES"
                    :key="type"
                    class="flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-semibold
                           transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    :class="draft.type === type
                      ? [ZONE_TYPE_META[type].bgClass, ZONE_TYPE_META[type].textClass, ZONE_TYPE_META[type].borderClass]
                      : 'bg-canvas border-line text-faint hover:bg-surface-soft hover:border-ink/20'"
                    @click="draft.type = type"
                  >
                    <span
                      class="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      :style="{ backgroundColor: ZONE_TYPE_META[type].color }"
                    />
                    {{ ZONE_TYPE_META[type].label }}
                  </button>
                </div>
              </div>

              <!-- Paid zone params -->
              <Transition
                enter-active-class="transition-all duration-150 overflow-hidden"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-40"
                leave-active-class="transition-all duration-100 overflow-hidden"
                leave-from-class="opacity-100 max-h-40"
                leave-to-class="opacity-0 max-h-0"
              >
                <div v-if="draft.type === 'paid'" class="space-y-3">
                  <div class="grid grid-cols-2 gap-3">
                    <!-- Delivery cost -->
                    <div class="space-y-1.5">
                      <label class="text-xs font-semibold text-faint uppercase tracking-wide">
                        Стоимость доставки, ₽
                      </label>
                      <input
                        v-model.number="draft.deliveryCost"
                        type="number"
                        min="0"
                        step="1"
                        class="w-full rounded-xl border px-3.5 py-2.5 text-sm text-ink
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                        :class="errors.deliveryCost ? 'border-red-300 bg-red-50' : 'border-line bg-canvas'"
                      />
                      <p v-if="errors.deliveryCost" class="text-xs text-red-500">{{ errors.deliveryCost }}</p>
                    </div>
                    <!-- Min order -->
                    <div class="space-y-1.5">
                      <label class="text-xs font-semibold text-faint uppercase tracking-wide">
                        Мин. сумма заказа, ₽
                      </label>
                      <input
                        v-model.number="draft.minOrderAmount"
                        type="number"
                        min="0"
                        step="50"
                        class="w-full rounded-xl border px-3.5 py-2.5 text-sm text-ink
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                        :class="errors.minOrderAmount ? 'border-red-300 bg-red-50' : 'border-line bg-canvas'"
                      />
                      <p v-if="errors.minOrderAmount" class="text-xs text-red-500">{{ errors.minOrderAmount }}</p>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Footer -->
            <div class="flex gap-2 px-5 py-4 border-t border-line">
              <button
                class="flex-1 py-2.5 rounded-xl border border-line text-sm font-medium text-muted
                       hover:text-ink hover:border-ink/20 transition-colors"
                @click="emit('close')"
              >
                Отмена
              </button>
              <button
                :disabled="!canSave"
                class="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold
                       hover:bg-accent-hover transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
                @click="submit"
              >
                {{ saving ? 'Сохраняем…' : (isEdit ? 'Сохранить' : 'Создать зону') }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
