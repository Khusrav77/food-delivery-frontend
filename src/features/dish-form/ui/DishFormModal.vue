<script setup lang="ts">
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import type { Dish, DishVariant } from '../../../entities/dish'
import { useDishStore } from '../../../entities/dish'
import { useTagStore, TagBadge } from '../../../entities/tag'
import { useCategoryStore } from '../../../entities/category'
import VariantEditor from './VariantEditor.vue'

const props = defineProps<{ dish?: Dish | null }>()
const emit = defineEmits<{ close: [] }>()

const dishStore = useDishStore()
const tagStore = useTagStore()
const categoryStore = useCategoryStore()

const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'

const name = ref('')
const description = ref('')
const imageUrl = ref('')
const categoryId = ref<string | null>(null)
const selectedTagIds = ref<string[]>([])
const isAvailable = ref(true)
const variants = ref<DishVariant[]>([
  { id: `v${Date.now()}`, label: '', weight: undefined, price: 0, isDefault: true },
])

const errors = ref<Record<string, string>>({})

watch(
  () => props.dish,
  (dish) => {
    if (dish) {
      name.value = dish.name
      description.value = dish.description
      imageUrl.value = dish.imageUrl
      categoryId.value = dish.categoryId
      selectedTagIds.value = [...dish.tagIds]
      isAvailable.value = dish.isAvailable
      variants.value = dish.variants.map(v => ({ ...v }))
    } else {
      name.value = ''
      description.value = ''
      imageUrl.value = ''
      categoryId.value = null
      selectedTagIds.value = []
      isAvailable.value = true
      variants.value = [{ id: `v${Date.now()}`, label: '', weight: undefined, price: 0, isDefault: true }]
    }
    errors.value = {}
  },
  { immediate: true },
)

function toggleTag(id: string) {
  const idx = selectedTagIds.value.indexOf(id)
  if (idx === -1) selectedTagIds.value.push(id)
  else selectedTagIds.value.splice(idx, 1)
}

function validate(): boolean {
  errors.value = {}
  if (!name.value.trim()) errors.value.name = 'Введите название'
  if (variants.value.length === 0) {
    errors.value.variants = 'Добавьте хотя бы один вариант'
  } else {
    for (const v of variants.value) {
      if (!v.label.trim()) { errors.value.variants = 'Заполните название варианта'; break }
      if (!v.price || v.price <= 0) { errors.value.variants = 'Укажите цену варианта'; break }
    }
  }
  return Object.keys(errors.value).length === 0
}

function save() {
  if (!validate()) return
  const data = {
    name: name.value.trim(),
    description: description.value.trim(),
    imageUrl: imageUrl.value.trim(),
    categoryId: categoryId.value,
    tagIds: selectedTagIds.value,
    isAvailable: isAvailable.value,
    variants: variants.value,
  }
  if (props.dish) {
    dishStore.updateDish(props.dish.id, data)
  } else {
    dishStore.addDish(data)
  }
  emit('close')
}

const previewSrc = ref('')
function onImageBlur() {
  previewSrc.value = imageUrl.value
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/50" @click="emit('close')" />

      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 class="text-lg font-semibold text-slate-900">
            {{ dish ? 'Редактировать блюдо' : 'Новое блюдо' }}
          </h2>
          <button class="p-1 text-slate-400 hover:text-slate-600" @click="emit('close')">
            <X :size="20" />
          </button>
        </div>

        <div class="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          <!-- Фото -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Фото (URL)</label>
            <div class="flex gap-3">
              <input
                v-model="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                class="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                @blur="onImageBlur"
              />
              <div class="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                <img
                  v-if="imageUrl"
                  :src="imageUrl"
                  class="w-full h-full object-cover"
                  @error="($event.target as HTMLImageElement).src = fallbackImage"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-300 text-xs">Фото</div>
              </div>
            </div>
          </div>

          <!-- Название и описание -->
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Название *</label>
              <input
                v-model="name"
                type="text"
                placeholder="Ролл Филадельфия"
                class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                :class="errors.name ? 'border-red-400' : 'border-slate-200'"
              />
              <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Описание</label>
              <textarea
                v-model="description"
                rows="2"
                placeholder="Краткое описание блюда..."
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <!-- Категория и теги -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Категория</label>
              <select
                v-model="categoryId"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              >
                <option :value="null">Без категории</option>
                <option
                  v-for="cat in categoryStore.categories"
                  :key="cat.id"
                  :value="cat.id"
                >
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Наличие</label>
              <label class="flex items-center gap-2 cursor-pointer mt-2">
                <div class="relative">
                  <input v-model="isAvailable" type="checkbox" class="sr-only peer" />
                  <div
                    class="w-10 h-5 bg-slate-200 peer-checked:bg-orange-500 rounded-full
                           after:content-[''] after:absolute after:top-0.5 after:left-0.5
                           after:bg-white after:rounded-full after:w-4 after:h-4
                           after:transition-all peer-checked:after:translate-x-5"
                  ></div>
                </div>
                <span class="text-sm text-slate-700">{{ isAvailable ? 'Доступно' : 'Скрыто' }}</span>
              </label>
            </div>
          </div>

          <!-- Теги -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Теги</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in tagStore.tags"
                :key="tag.id"
                type="button"
                class="transition-all"
                :class="selectedTagIds.includes(tag.id) ? 'ring-2 ring-orange-400 ring-offset-1 rounded-full' : 'opacity-60 hover:opacity-100'"
                @click="toggleTag(tag.id)"
              >
                <TagBadge :tag="tag" />
              </button>
            </div>
          </div>

          <!-- Варианты -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Варианты / порции *</label>
            <VariantEditor v-model="variants" />
            <p v-if="errors.variants" class="text-red-500 text-xs mt-1">{{ errors.variants }}</p>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            @click="emit('close')"
          >
            Отмена
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            @click="save"
          >
            {{ dish ? 'Сохранить' : 'Создать' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
