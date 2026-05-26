<script setup lang="ts">
import { X, Pencil, Trash2, Check } from 'lucide-vue-next'
import { useCategoryManager } from '../model/useCategoryManager'

const emit = defineEmits<{ close: [] }>()

const {
  categoryStore,
  productStore,
  newName,
  editingId,
  editingName,
  startEdit,
  confirmEdit,
  addCategory,
  remove,
} = useCategoryManager()
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-ink/50" @click="emit('close')" />

      <div class="relative bg-surface rounded-2xl shadow-2xl w-full max-w-sm flex flex-col">
        <div class="flex items-center justify-between px-5 py-4 border-b border-line-strong">
          <h2 class="text-lg font-semibold text-ink">Категории</h2>
          <button class="p-1 text-faint hover:text-muted" @click="emit('close')">
            <X :size="20" />
          </button>
        </div>

        <div class="p-5 space-y-2 max-h-80 overflow-y-auto">
          <div
            v-for="cat in categoryStore.categories"
            :key="cat.id"
            class="flex items-center gap-2 group"
          >
            <template v-if="editingId === cat.id">
              <input
                v-model="editingName"
                class="flex-1 border border-accent rounded-lg px-2 py-1 text-sm focus:outline-none"
                @keyup.enter="confirmEdit(cat.id)"
                @keyup.escape="editingId = null"
              />
              <button class="p-1 text-accent hover:text-accent-hover" @click="confirmEdit(cat.id)">
                <Check :size="16" />
              </button>
            </template>
            <template v-else>
              <span class="flex-1 text-sm text-ink">{{ cat.name }}</span>
              <span class="text-xs text-faint">
                {{ productStore.products.filter(d => d.categoryId === cat.id).length }} блюд
              </span>
              <button
                class="p-1 text-faint hover:text-accent transition-colors"
                @click="startEdit(cat.id, cat.name)"
              >
                <Pencil :size="14" />
              </button>
              <button
                class="p-1 text-faint hover:text-red-500 transition-colors"
                @click="remove(cat.id)"
              >
                <Trash2 :size="14" />
              </button>
            </template>
          </div>

          <p v-if="!categoryStore.categories.length" class="text-faint text-sm text-center py-4">
            Нет категорий
          </p>
        </div>

        <div class="px-5 py-4 border-t border-line-strong">
          <div class="flex gap-2">
            <input
              v-model="newName"
              type="text"
              placeholder="Название категории"
              class="flex-1 border border-line-strong rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              @keyup.enter="addCategory"
            />
            <button
              class="px-3 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
              @click="addCategory"
            >
              Добавить
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>