<script setup lang="ts">
import { X, Trash2 } from 'lucide-vue-next'
import { TagBadge } from '../../../entities/tag'
import { useTagManager } from '../model/useTagManager'

const emit = defineEmits<{ close: [] }>()

const { tagStore, newLabel, newEmoji, newColor, colorOptions, addTag } = useTagManager()
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-ink/50" @click="emit('close')" />

      <div class="relative bg-surface rounded-2xl shadow-2xl w-full max-w-sm flex flex-col">
        <div class="flex items-center justify-between px-5 py-4 border-b border-line-strong">
          <h2 class="text-lg font-semibold text-ink">Теги</h2>
          <button class="p-1 text-faint hover:text-muted" @click="emit('close')">
            <X :size="20" />
          </button>
        </div>

        <div class="p-5 space-y-2 max-h-72 overflow-y-auto">
          <div
            v-for="tag in tagStore.tags"
            :key="tag.id"
            class="flex items-center justify-between"
          >
            <TagBadge :tag="tag" />
            <button
              class="p-1 text-faint hover:text-red-500 transition-colors"
              @click="tagStore.removeTag(tag.id)"
            >
              <Trash2 :size="14" />
            </button>
          </div>
          <p v-if="!tagStore.tags.length" class="text-faint text-sm text-center py-4">
            Нет тегов
          </p>
        </div>

        <div class="px-5 py-4 border-t border-line-strong space-y-3">
          <div class="flex gap-2">
            <input
              v-model="newEmoji"
              type="text"
              placeholder="😀"
              maxlength="2"
              class="w-14 border border-line-strong rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              v-model="newLabel"
              type="text"
              placeholder="Название тега"
              class="flex-1 border border-line-strong rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              @keyup.enter="addTag"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-muted">Цвет:</span>
            <div class="flex gap-1.5 flex-1">
              <button
                v-for="c in colorOptions"
                :key="c.value"
                type="button"
                :title="c.label"
                :class="[
                  'w-5 h-5 rounded-full transition-transform',
                  c.cls,
                  newColor === c.value ? 'ring-2 ring-offset-1 ring-ink scale-110' : 'hover:scale-110',
                ]"
                @click="newColor = c.value"
              />
            </div>
            <button
              class="px-3 py-1.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
              @click="addTag"
            >
              Добавить
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>