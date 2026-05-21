<script setup lang="ts">
import { computed } from 'vue'
import { Pencil, Trash2 } from 'lucide-vue-next'
import type { Product } from '../model/types'
import { SIZE_UNIT_LABELS } from '../model/types'
import { useTagStore } from '../../tag'
import { useCategoryStore } from '../../category'
import TagBadge from '../../tag/ui/TagBadge.vue'

const props = defineProps<{ product: Product }>()
const emit = defineEmits<{
  edit: [product: Product]
  remove: [id: string]
  toggleActive: [id: string]
}>()

const tagStore = useTagStore()
const categoryStore = useCategoryStore()

const category = computed(() =>
  props.product.categoryId ? categoryStore.getById(props.product.categoryId) : null,
)

// Агрегируем уникальные теги со всех menu_items
const uniqueTags = computed(() => {
  const ids = new Set(props.product.menuItems.flatMap(mi => mi.tagIds))
  return [...ids].map(id => tagStore.getById(id)).filter(Boolean)
})

// Первое изображение из первого активного menu_item
const previewImage = computed(() => {
  const item = props.product.menuItems.find(mi => mi.images.length > 0)
  return item?.images[0]?.url ?? ''
})

const minPrice = computed(() =>
  props.product.menuItems.length
    ? Math.min(...props.product.menuItems.map(mi => mi.price))
    : 0,
)
const hasMultiple = computed(() => props.product.menuItems.length > 1)

const fallback = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'

function formatSizes(mi: Product['menuItems'][number]) {
  return mi.sizes
    .map(s => `${s.sizeValue} ${SIZE_UNIT_LABELS[s.sizeUnit]}`)
    .join(' · ')
}
</script>

<template>
  <div
    :class="[
      'bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col transition-shadow hover:shadow-md',
      !product.isActive && 'opacity-60',
    ]"
  >
    <!-- Фото -->
    <div class="relative aspect-[4/3] overflow-hidden bg-slate-100">
      <img
        :src="previewImage || fallback"
        :alt="product.name"
        class="w-full h-full object-cover"
        @error="($event.target as HTMLImageElement).src = fallback"
      />
      <div v-if="uniqueTags.length" class="absolute top-2 left-2 flex flex-wrap gap-1">
        <TagBadge v-for="tag in uniqueTags" :key="tag!.id" :tag="tag!" small />
      </div>
      <div v-if="!product.isActive" class="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
        <span class="bg-slate-900/70 text-white text-xs font-medium px-2 py-1 rounded">Недоступно</span>
      </div>
    </div>

    <!-- Контент -->
    <div class="flex flex-col flex-1 p-3 gap-2">
      <div>
        <h3 class="font-semibold text-slate-900 text-sm leading-tight">{{ product.name }}</h3>
        <p class="text-slate-500 text-xs mt-0.5 line-clamp-2">{{ product.description }}</p>
      </div>

      <div class="mt-auto space-y-1.5">
        <!-- Варианты -->
        <template v-if="hasMultiple">
          <div
            v-for="mi in product.menuItems"
            :key="mi.id"
            class="flex justify-between items-center text-xs"
          >
            <span class="text-slate-500">
              {{ mi.name }}
              <span v-if="formatSizes(mi)" class="text-slate-400"> · {{ formatSizes(mi) }}</span>
            </span>
            <span class="font-semibold text-slate-800">{{ mi.price }} ₽</span>
          </div>
        </template>
        <template v-else-if="product.menuItems[0]">
          <div class="flex justify-between items-center">
            <span class="text-slate-500 text-xs">
              {{ product.menuItems[0].name }}
              <span v-if="formatSizes(product.menuItems[0])" class="text-slate-400">
                · {{ formatSizes(product.menuItems[0]) }}
              </span>
            </span>
            <span class="font-bold text-slate-900 text-sm">{{ product.menuItems[0].price }} ₽</span>
          </div>
        </template>
        <div v-else class="text-xs text-slate-400 italic">Нет вариантов</div>

        <!-- Footer -->
        <div class="flex items-center justify-between pt-1 border-t border-slate-100">
          <span class="text-xs text-slate-400">{{ category?.name ?? 'Без категории' }}</span>
          <div class="flex items-center gap-1">
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                class="sr-only peer"
                :checked="product.isActive"
                @change="emit('toggleActive', product.id)"
              />
              <div
                class="w-8 h-4 bg-slate-200 peer-checked:bg-orange-500 rounded-full peer
                       after:content-[''] after:absolute after:top-0.5 after:left-0.5
                       after:bg-white after:rounded-full after:w-3 after:h-3
                       after:transition-all peer-checked:after:translate-x-4"
              ></div>
            </label>
            <button
              class="p-1 text-slate-400 hover:text-orange-500 transition-colors"
              @click="emit('edit', product)"
            >
              <Pencil :size="14" />
            </button>
            <button
              class="p-1 text-slate-400 hover:text-red-500 transition-colors"
              @click="emit('remove', product.id)"
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
