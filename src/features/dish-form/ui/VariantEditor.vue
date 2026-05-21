<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Trash2, ChevronDown, ChevronRight, X, Image } from 'lucide-vue-next'
import type { MenuItem, MenuItemSize, SizeType, SizeUnit } from '../../../entities/dish'
import { SIZE_TYPE_LABELS, SIZE_UNIT_LABELS, SIZE_UNIT_BY_TYPE } from '../../../entities/dish'
import { useTagStore, TagBadge } from '../../../entities/tag'

export interface MenuItemDraft {
  id: string
  name: string
  price: number
  isActive: boolean
  imageUrls: string[]
  sizes: Omit<MenuItemSize, 'id' | 'menuItemId'>[]
  tagIds: string[]
}

const items = defineModel<MenuItemDraft[]>({ required: true })

const tagStore = useTagStore()
const expanded = ref<Set<string>>(new Set())

function toggle(id: string) {
  if (expanded.value.has(id)) expanded.value.delete(id)
  else expanded.value.add(id)
}

function addItem() {
  const id = `draft-${Date.now()}`
  items.value.push({ id, name: '', price: 0, isActive: true, imageUrls: [''], sizes: [], tagIds: [] })
  expanded.value.add(id)
}

function removeItem(id: string) {
  if (items.value.length <= 1) return
  items.value = items.value.filter(i => i.id !== id)
  expanded.value.delete(id)
}

function addSize(item: MenuItemDraft) {
  item.sizes.push({ sizeType: 'weight', sizeValue: 0, sizeUnit: 'gram' })
}

function removeSize(item: MenuItemDraft, idx: number) {
  item.sizes.splice(idx, 1)
}

function onSizeTypeChange(size: MenuItemDraft['sizes'][number], type: SizeType) {
  size.sizeType = type
  size.sizeUnit = SIZE_UNIT_BY_TYPE[type][0]
}

function addImageUrl(item: MenuItemDraft) {
  item.imageUrls.push('')
}

function removeImageUrl(item: MenuItemDraft, idx: number) {
  item.imageUrls.splice(idx, 1)
}

function toggleTag(item: MenuItemDraft, tagId: string) {
  const idx = item.tagIds.indexOf(tagId)
  if (idx === -1) item.tagIds.push(tagId)
  else item.tagIds.splice(idx, 1)
}

function toMenuItem(draft: MenuItemDraft): Omit<MenuItem, 'id' | 'productId'> {
  return {
    name: draft.name,
    price: draft.price,
    isActive: draft.isActive,
    position: 0,
    images: draft.imageUrls
      .filter(u => u.trim())
      .map((url, i) => ({ id: `img-${Date.now()}-${i}`, menuItemId: '', url, position: i + 1 })),
    sizes: draft.sizes.map((s, i) => ({ ...s, id: `sz-${Date.now()}-${i}`, menuItemId: '' })),
    tagIds: draft.tagIds,
  }
}

defineExpose({ toMenuItem })
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="item in items"
      :key="item.id"
      class="border border-slate-200 rounded-xl overflow-hidden"
    >
      <!-- Header строка варианта -->
      <div
        class="flex items-center gap-2 px-3 py-2 bg-slate-50 cursor-pointer select-none"
        @click="toggle(item.id)"
      >
        <component :is="expanded.has(item.id) ? ChevronDown : ChevronRight" :size="14" class="text-slate-400 flex-shrink-0" />

        <input
          v-model="item.name"
          type="text"
          placeholder="4 шт / 20 см"
          class="flex-1 bg-transparent text-sm font-medium text-slate-800 focus:outline-none min-w-0"
          @click.stop
        />

        <div class="flex items-center gap-1 flex-shrink-0">
          <span class="text-xs text-slate-400">₽</span>
          <input
            v-model.number="item.price"
            type="number"
            min="0"
            placeholder="0"
            class="w-20 bg-white border border-slate-200 rounded px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-orange-400"
            @click.stop
          />
        </div>

        <label class="relative inline-flex items-center cursor-pointer flex-shrink-0" @click.stop>
          <input v-model="item.isActive" type="checkbox" class="sr-only peer" />
          <div
            class="w-7 h-3.5 bg-slate-200 peer-checked:bg-orange-500 rounded-full
                   after:content-[''] after:absolute after:top-[1px] after:left-[1px]
                   after:bg-white after:rounded-full after:w-3 after:h-3
                   after:transition-all peer-checked:after:translate-x-3.5"
          ></div>
        </label>

        <button
          type="button"
          :disabled="items.length <= 1"
          class="p-1 text-slate-300 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          @click.stop="removeItem(item.id)"
        >
          <Trash2 :size="13" />
        </button>
      </div>

      <!-- Раскрытая секция: изображения, размеры, теги -->
      <div v-if="expanded.has(item.id)" class="px-4 py-3 space-y-4 border-t border-slate-100">

        <!-- Фото -->
        <div>
          <p class="text-xs font-medium text-slate-600 mb-1.5 flex items-center gap-1">
            <Image :size="12" /> Фото
          </p>
          <div class="space-y-1.5">
            <div v-for="(url, idx) in item.imageUrls" :key="idx" class="flex items-center gap-2">
              <input
                v-model="item.imageUrls[idx]"
                type="url"
                placeholder="https://example.com/image.jpg"
                class="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <div class="w-10 h-8 rounded overflow-hidden bg-slate-100 flex-shrink-0">
                <img
                  v-if="url"
                  :src="url"
                  class="w-full h-full object-cover"
                  @error="($event.target as HTMLImageElement).style.display = 'none'"
                />
              </div>
              <button
                v-if="item.imageUrls.length > 1"
                type="button"
                class="p-1 text-slate-300 hover:text-red-500 transition-colors"
                @click="removeImageUrl(item, idx)"
              >
                <X :size="12" />
              </button>
            </div>
          </div>
          <button
            type="button"
            class="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-xs font-medium mt-1.5"
            @click="addImageUrl(item)"
          >
            <Plus :size="11" /> Добавить фото
          </button>
        </div>

        <!-- Размеры -->
        <div>
          <p class="text-xs font-medium text-slate-600 mb-1.5">Размеры</p>
          <div v-if="item.sizes.length" class="space-y-1.5 mb-1.5">
            <div v-for="(size, idx) in item.sizes" :key="idx" class="flex items-center gap-2">
              <select
                :value="size.sizeType"
                class="border border-slate-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                @change="onSizeTypeChange(size, ($event.target as HTMLSelectElement).value as SizeType)"
              >
                <option v-for="(label, type) in SIZE_TYPE_LABELS" :key="type" :value="type">
                  {{ label }}
                </option>
              </select>
              <input
                v-model.number="size.sizeValue"
                type="number"
                min="0"
                placeholder="0"
                class="w-20 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <select
                v-model="size.sizeUnit"
                class="border border-slate-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option
                  v-for="unit in SIZE_UNIT_BY_TYPE[size.sizeType as SizeType]"
                  :key="unit"
                  :value="unit"
                >
                  {{ SIZE_UNIT_LABELS[unit as SizeUnit] }}
                </option>
              </select>
              <button
                type="button"
                class="p-1 text-slate-300 hover:text-red-500 transition-colors"
                @click="removeSize(item, idx)"
              >
                <X :size="12" />
              </button>
            </div>
          </div>
          <button
            type="button"
            class="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-xs font-medium"
            @click="addSize(item)"
          >
            <Plus :size="11" /> Добавить размер
          </button>
        </div>

        <!-- Теги -->
        <div>
          <p class="text-xs font-medium text-slate-600 mb-1.5">Теги варианта</p>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="tag in tagStore.tags"
              :key="tag.id"
              type="button"
              class="transition-all"
              :class="item.tagIds.includes(tag.id) ? 'ring-2 ring-orange-400 ring-offset-1 rounded-full' : 'opacity-50 hover:opacity-100'"
              @click="toggleTag(item, tag.id)"
            >
              <TagBadge :tag="tag" small />
            </button>
          </div>
        </div>

      </div>
    </div>

    <button
      type="button"
      class="flex items-center gap-1.5 text-orange-500 hover:text-orange-600 text-sm font-medium"
      @click="addItem"
    >
      <Plus :size="14" /> Добавить вариант
    </button>
  </div>
</template>
