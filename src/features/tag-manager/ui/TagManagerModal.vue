<script setup lang="ts">
import { ref } from 'vue'
import { X, Trash2 } from 'lucide-vue-next'
import { useTagStore, TagBadge } from '../../../entities/tag'
import type { TagColor } from '../../../entities/tag'

const emit = defineEmits<{ close: [] }>()
const tagStore = useTagStore()

const colorOptions: { value: TagColor; label: string; cls: string }[] = [
  { value: 'red', label: 'Красный', cls: 'bg-red-500' },
  { value: 'orange', label: 'Оранжевый', cls: 'bg-orange-500' },
  { value: 'green', label: 'Зелёный', cls: 'bg-green-500' },
  { value: 'emerald', label: 'Изумрудный', cls: 'bg-emerald-500' },
  { value: 'blue', label: 'Синий', cls: 'bg-blue-500' },
  { value: 'violet', label: 'Фиолетовый', cls: 'bg-violet-500' },
  { value: 'yellow', label: 'Жёлтый', cls: 'bg-yellow-500' },
]

const newLabel = ref('')
const newEmoji = ref('')
const newColor = ref<TagColor>('orange')

async function addTag() {
  if (!newLabel.value.trim()) return
  await tagStore.addTag({ label: newLabel.value.trim(), color: newColor.value, emoji: newEmoji.value || undefined })
  newLabel.value = ''
  newEmoji.value = ''
  newColor.value = 'orange'
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/50" @click="emit('close')" />

      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 class="text-lg font-semibold text-slate-900">Теги</h2>
          <button class="p-1 text-slate-400 hover:text-slate-600" @click="emit('close')">
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
              class="p-1 text-slate-300 hover:text-red-500 transition-colors"
              @click="tagStore.removeTag(tag.id)"
            >
              <Trash2 :size="14" />
            </button>
          </div>
          <p v-if="!tagStore.tags.length" class="text-slate-400 text-sm text-center py-4">
            Нет тегов
          </p>
        </div>

        <div class="px-5 py-4 border-t border-slate-200 space-y-3">
          <div class="flex gap-2">
            <input
              v-model="newEmoji"
              type="text"
              placeholder="😀"
              maxlength="2"
              class="w-14 border border-slate-200 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              v-model="newLabel"
              type="text"
              placeholder="Название тега"
              class="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              @keyup.enter="addTag"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500">Цвет:</span>
            <div class="flex gap-1.5 flex-1">
              <button
                v-for="c in colorOptions"
                :key="c.value"
                type="button"
                :title="c.label"
                :class="[
                  'w-5 h-5 rounded-full transition-transform',
                  c.cls,
                  newColor === c.value ? 'ring-2 ring-offset-1 ring-slate-400 scale-110' : 'hover:scale-110',
                ]"
                @click="newColor = c.value"
              />
            </div>
            <button
              class="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
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
