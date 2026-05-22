<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, Loader2 } from 'lucide-vue-next'
import type { Product } from '../../../entities/dish'
import { useProductStore } from '../../../entities/dish'
import { useCategoryStore } from '../../../entities/category'
import VariantEditor, { type MenuItemDraft } from './VariantEditor.vue'

const props = defineProps<{ product?: Product | null }>()
const emit = defineEmits<{ close: [] }>()

const productStore = useProductStore()
const categoryStore = useCategoryStore()

const name = ref('')
const description = ref('')
const categoryId = ref<string | null>(null)
const isActive = ref(true)
const menuItems = ref<MenuItemDraft[]>([])

const errors = ref<Record<string, string>>({})
const saving = ref(false)
const saveError = ref<string | null>(null)

function defaultDraft(): MenuItemDraft {
  return { id: `draft-${Date.now()}`, name: '', price: 0, isActive: true, imageUrls: [''], sizes: [], tagIds: [] }
}

function productToDraft(mi: Product['menuItems'][number]): MenuItemDraft {
  return {
    id: mi.id,
    name: mi.name,
    price: mi.price,
    isActive: mi.isActive,
    imageUrls: mi.images.length ? mi.images.map(img => img.url) : [''],
    sizes: mi.sizes.map(s => ({ sizeType: s.sizeType, sizeValue: s.sizeValue, sizeUnit: s.sizeUnit })),
    tagIds: [...mi.tagIds],
  }
}

watch(
  () => props.product,
  (product) => {
    if (product) {
      name.value = product.name
      description.value = product.description
      categoryId.value = product.categoryId
      isActive.value = product.isActive
      menuItems.value = product.menuItems.map(productToDraft)
    } else {
      name.value = ''
      description.value = ''
      categoryId.value = null
      isActive.value = true
      menuItems.value = [defaultDraft()]
    }
    errors.value = {}
  },
  { immediate: true },
)

function validate(): boolean {
  errors.value = {}
  if (!name.value.trim()) errors.value.name = 'Введите название'
  if (menuItems.value.length === 0) {
    errors.value.items = 'Добавьте хотя бы один вариант'
  } else {
    for (const mi of menuItems.value) {
      if (!mi.name.trim()) { errors.value.items = 'Заполните название варианта'; break }
      if (!mi.price || mi.price <= 0) { errors.value.items = 'Укажите цену варианта'; break }
    }
  }
  return Object.keys(errors.value).length === 0
}

function draftToMenuItem(draft: MenuItemDraft, idx: number): Product['menuItems'][number] {
  return {
    id: draft.id.startsWith('draft-') ? `mi${Date.now()}${idx}` : draft.id,
    productId: props.product?.id ?? '',
    name: draft.name.trim(),
    price: draft.price,
    isActive: draft.isActive,
    position: idx + 1,
    images: draft.imageUrls
      .filter(u => u.trim())
      .map((url, i) => ({ id: `img${Date.now()}${i}`, menuItemId: '', url, position: i + 1 })),
    sizes: draft.sizes
      .filter(s => s.sizeValue > 0)
      .map((s, i) => ({ ...s, id: `sz${Date.now()}${i}`, menuItemId: '' })),
    tagIds: draft.tagIds,
  }
}

async function save() {
  if (!validate()) return
  saving.value = true
  saveError.value = null
  try {
    const data = {
      categoryId: categoryId.value,
      name: name.value.trim(),
      description: description.value.trim(),
      isActive: isActive.value,
      position: props.product?.position ?? 0,
      menuItems: menuItems.value.map(draftToMenuItem),
    }
    if (props.product) {
      await productStore.updateProduct(props.product.id, data)
    } else {
      await productStore.addProduct(data)
    }
    emit('close')
  } catch (e) {
    saveError.value = (e as { message: string }).message ?? 'Ошибка сохранения'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/50" @click="emit('close')" />

      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 class="text-lg font-semibold text-slate-900">
            {{ product ? 'Редактировать блюдо' : 'Новое блюдо' }}
          </h2>
          <button class="p-1 text-slate-400 hover:text-slate-600" @click="emit('close')">
            <X :size="20" />
          </button>
        </div>

        <div class="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          <!-- Название и описание -->
          <div class="space-y-3">
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

          <!-- Категория + Наличие -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Категория</label>
              <select
                v-model="categoryId"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              >
                <option :value="null">Без категории</option>
                <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Наличие</label>
              <label class="flex items-center gap-2 cursor-pointer mt-2">
                <div class="relative">
                  <input v-model="isActive" type="checkbox" class="sr-only peer" />
                  <div
                    class="w-10 h-5 bg-slate-200 peer-checked:bg-orange-500 rounded-full
                           after:content-[''] after:absolute after:top-0.5 after:left-0.5
                           after:bg-white after:rounded-full after:w-4 after:h-4
                           after:transition-all peer-checked:after:translate-x-5"
                  ></div>
                </div>
                <span class="text-sm text-slate-700">{{ isActive ? 'Доступно' : 'Скрыто' }}</span>
              </label>
            </div>
          </div>

          <!-- Варианты (menu_items) -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-slate-700">
                Варианты / порции *
              </label>
              <span class="text-xs text-slate-400">
                Фото, размеры и теги — на каждом варианте
              </span>
            </div>
            <VariantEditor v-model="menuItems" />
            <p v-if="errors.items" class="text-red-500 text-xs mt-1">{{ errors.items }}</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
          <p v-if="saveError" class="flex-1 text-sm text-red-500">{{ saveError }}</p>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            :disabled="saving"
            @click="emit('close')"
          >
            Отмена
          </button>
          <button
            type="button"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white rounded-lg transition-colors"
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
