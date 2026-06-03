<script setup lang="ts">
import { computed } from 'vue'
import { X } from 'lucide-vue-next'
import {
  BANNER_PRESETS,
  resolveBannerImage,
  presetKey,
  isPresetKey,
  type IBannerDraft,
  type IBannerDraftErrors,
} from '@/entities/banner'

const props = defineProps<{
  draft: IBannerDraft
  errors: IBannerDraftErrors
  canSave: boolean
  isEditing: boolean
}>()
defineEmits<{ save: []; close: [] }>()

// URL field stays empty while a bundled preset is selected; typing a URL replaces the preset.
const urlValue = computed({
  get: () => (isPresetKey(props.draft.image) ? '' : props.draft.image),
  set: (v: string) => { props.draft.image = v },
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <div class="w-full max-w-lg bg-surface rounded-3xl shadow-xl border border-line max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
          <h3 class="font-semibold text-ink">{{ isEditing ? 'Редактировать баннер' : 'Новый баннер' }}</h3>
          <button
            class="w-8 h-8 rounded-full flex items-center justify-center text-faint hover:text-ink hover:bg-surface-soft
                   transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            aria-label="Закрыть"
            @click="$emit('close')"
          >
            <X :size="16" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-5 space-y-4 overflow-y-auto">
          <!-- Live preview -->
          <div class="relative w-full h-40 rounded-2xl overflow-hidden bg-canvas border border-line">
            <img
              v-if="resolveBannerImage(draft.image)"
              :src="resolveBannerImage(draft.image)"
              alt=""
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div v-if="draft.showOverlay" class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <span
              v-if="draft.badge"
              class="absolute top-3 right-3 bg-white/25 backdrop-blur-sm text-white text-xs font-extrabold px-3 py-1 rounded-full"
            >
              {{ draft.badge }}
            </span>
            <div v-if="draft.showOverlay" class="absolute inset-x-0 bottom-0 p-4">
              <h4 class="font-display text-lg font-extrabold text-white leading-snug">{{ draft.title || 'Заголовок' }}</h4>
              <p v-if="draft.subtitle" class="text-white/80 text-xs mt-0.5">{{ draft.subtitle }}</p>
            </div>
          </div>

          <!-- Preset gallery -->
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-faint uppercase tracking-wide">Картинка из набора</label>
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="preset in BANNER_PRESETS"
                :key="preset.id"
                type="button"
                class="relative aspect-video rounded-lg overflow-hidden border-2 transition-all
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                :class="draft.image === presetKey(preset.id) ? 'border-accent ring-2 ring-accent/30' : 'border-line hover:border-ink/30'"
                :title="preset.label"
                @click="draft.image = presetKey(preset.id)"
              >
                <img :src="preset.src" :alt="preset.label" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Image URL -->
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-faint uppercase tracking-wide">Или URL картинки</label>
            <input
              v-model="urlValue"
              type="url"
              placeholder="https://…"
              class="w-full rounded-xl border px-3.5 py-2.5 text-sm text-ink placeholder:text-faint
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              :class="errors.image ? 'border-red-300 bg-red-50' : 'border-line bg-canvas'"
            />
            <p v-if="errors.image" class="text-xs text-red-500">{{ errors.image }}</p>
          </div>

          <!-- Overlay toggle -->
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm text-ink">Показывать текст поверх картинки</span>
            <input v-model="draft.showOverlay" type="checkbox" class="w-4 h-4 accent-accent" />
          </label>

          <!-- Overlay fields -->
          <template v-if="draft.showOverlay">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-faint uppercase tracking-wide">Заголовок</label>
              <input
                v-model="draft.title"
                type="text"
                placeholder="Большая распродажа"
                class="w-full rounded-xl border px-3.5 py-2.5 text-sm text-ink placeholder:text-faint
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                :class="errors.title ? 'border-red-300 bg-red-50' : 'border-line bg-canvas'"
              />
              <p v-if="errors.title" class="text-xs text-red-500">{{ errors.title }}</p>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-faint uppercase tracking-wide">Подзаголовок</label>
              <input
                v-model="draft.subtitle"
                type="text"
                placeholder="Скидки до 50%"
                class="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink placeholder:text-faint
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-faint uppercase tracking-wide">Текст кнопки</label>
                <input
                  v-model="draft.ctaLabel"
                  type="text"
                  placeholder="Заказать"
                  class="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink placeholder:text-faint
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-faint uppercase tracking-wide">Бейдж</label>
                <input
                  v-model="draft.badge"
                  type="text"
                  placeholder="−50%"
                  class="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink placeholder:text-faint
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-faint uppercase tracking-wide">Ссылка по клику</label>
              <input
                v-model="draft.href"
                type="text"
                placeholder="/"
                class="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink placeholder:text-faint
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              />
            </div>
          </template>

          <!-- Active toggle -->
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm text-ink">Показывать на сайте</span>
            <input v-model="draft.isActive" type="checkbox" class="w-4 h-4 accent-accent" />
          </label>
        </div>

        <!-- Footer -->
        <div class="flex gap-2 px-5 py-4 border-t border-line shrink-0">
          <button
            class="flex-1 py-2.5 rounded-xl border border-line text-sm font-medium text-muted
                   hover:text-ink hover:border-ink/20 transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            @click="$emit('close')"
          >
            Отмена
          </button>
          <button
            class="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold
                   hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            :disabled="!canSave"
            @click="$emit('save')"
          >
            {{ isEditing ? 'Сохранить' : 'Добавить' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
