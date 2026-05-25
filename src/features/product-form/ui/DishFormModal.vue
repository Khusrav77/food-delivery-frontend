<script setup lang="ts">
import { toRef } from 'vue'
import { X, Loader2 } from 'lucide-vue-next'
import { useCategoryStore } from '../../../entities/category'
import type { Product } from '../../../entities/dish'
import { useDishForm } from '../model/useDishForm'
import VariantEditor from './VariantEditor.vue'

const props = defineProps<{ product?: Product | null }>()
const emit = defineEmits<{ close: [] }>()

const categoryStore = useCategoryStore()
const { name, description, categoryId, isActive, menuItems, errors, saving, saveError, save } =
  useDishForm(toRef(props, 'product'), () => emit('close'))
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-ink/50" @click="emit('close')" />

      <div class="relative bg-surface rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-line-strong">
          <h2 class="text-lg font-semibold text-ink">
            {{ product ? 'Редактировать блюдо' : 'Новое блюдо' }}
          </h2>
          <button class="p-1 text-faint hover:text-muted" @click="emit('close')">
            <X :size="20" />
          </button>
        </div>

        <div class="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          <!-- Название и описание -->
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-ink mb-1">Название *</label>
              <input
                v-model="name"
                type="text"
                placeholder="Ролл Филадельфия"
                class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                :class="errors.name ? 'border-red-400' : 'border-line-strong'"
              />
              <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-ink mb-1">Описание</label>
              <textarea
                v-model="description"
                rows="2"
                placeholder="Краткое описание блюда..."
                class="w-full border border-line-strong rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <!-- Категория + Наличие -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-ink mb-1">Категория</label>
              <select
                v-model="categoryId"
                class="w-full border border-line-strong rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-surface"
              >
                <option :value="null">Без категории</option>
                <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-ink mb-1">Наличие</label>
              <label class="flex items-center gap-2 cursor-pointer mt-2">
                <div class="relative">
                  <input v-model="isActive" type="checkbox" class="sr-only peer" />
                  <div
                    class="w-10 h-5 bg-line-strong peer-checked:bg-accent rounded-full
                           after:content-[''] after:absolute after:top-0.5 after:left-0.5
                           after:bg-surface after:rounded-full after:w-4 after:h-4
                           after:transition-all peer-checked:after:translate-x-5"
                  ></div>
                </div>
                <span class="text-sm text-ink">{{ isActive ? 'Доступно' : 'Скрыто' }}</span>
              </label>
            </div>
          </div>

          <!-- Варианты (menu_items) -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-ink">
                Варианты / порции *
              </label>
              <span class="text-xs text-faint">
                Фото, размеры и теги — на каждом варианте
              </span>
            </div>
            <VariantEditor v-model="menuItems" />
            <p v-if="errors.items" class="text-red-500 text-xs mt-1">{{ errors.items }}</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-line-strong">
          <p v-if="saveError" class="flex-1 text-sm text-red-500">{{ saveError }}</p>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-ink hover:bg-surface-soft rounded-lg transition-colors"
            :disabled="saving"
            @click="emit('close')"
          >
            Отмена
          </button>
          <button
            type="button"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-accent hover:bg-accent-hover disabled:opacity-60 text-white rounded-lg transition-colors"
            :disabled="saving"
            @click="save"
          >
            <Loader2 v-if="saving" :size="14" class="animate-spin" />
            {{ product ? 'Сохранить' : 'Создать' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>