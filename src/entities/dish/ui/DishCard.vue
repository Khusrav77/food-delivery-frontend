<script setup lang="ts">
import { computed } from 'vue'
import { Pencil, Trash2 } from 'lucide-vue-next'
import type { Dish } from '../model/types'
import { useTagStore } from '../../tag'
import { useCategoryStore } from '../../category'
import TagBadge from '../../tag/ui/TagBadge.vue'

const props = defineProps<{ dish: Dish }>()
const emit = defineEmits<{
  edit: [dish: Dish]
  remove: [id: string]
  toggleAvailability: [id: string]
}>()

const tagStore = useTagStore()
const categoryStore = useCategoryStore()

const tags = computed(() => props.dish.tagIds.map(id => tagStore.getById(id)).filter(Boolean))
const category = computed(() =>
  props.dish.categoryId ? categoryStore.getById(props.dish.categoryId) : null,
)
const minPrice = computed(() => Math.min(...props.dish.variants.map(v => v.price)))
const hasMultipleVariants = computed(() => props.dish.variants.length > 1)

const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'
</script>

<template>
  <div
    :class="[
      'bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col transition-shadow hover:shadow-md',
      !dish.isAvailable && 'opacity-60',
    ]"
  >
    <div class="relative aspect-[4/3] overflow-hidden bg-slate-100">
      <img
        :src="dish.imageUrl || fallbackImage"
        :alt="dish.name"
        class="w-full h-full object-cover"
        @error="($event.target as HTMLImageElement).src = fallbackImage"
      />
      <div class="absolute top-2 left-2 flex flex-wrap gap-1">
        <TagBadge v-for="tag in tags" :key="tag!.id" :tag="tag!" small />
      </div>
      <div v-if="!dish.isAvailable" class="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
        <span class="bg-slate-900/70 text-white text-xs font-medium px-2 py-1 rounded">Недоступно</span>
      </div>
    </div>

    <div class="flex flex-col flex-1 p-3 gap-2">
      <div>
        <h3 class="font-semibold text-slate-900 text-sm leading-tight">{{ dish.name }}</h3>
        <p class="text-slate-500 text-xs mt-0.5 line-clamp-2">{{ dish.description }}</p>
      </div>

      <div class="mt-auto space-y-2">
        <div v-if="hasMultipleVariants" class="space-y-1">
          <div
            v-for="v in dish.variants"
            :key="v.id"
            class="flex justify-between items-center text-xs"
          >
            <span class="text-slate-500">
              {{ v.label }}<span v-if="v.weight" class="text-slate-400"> · {{ v.weight }} г</span>
            </span>
            <span class="font-semibold text-slate-800">{{ v.price }} ₽</span>
          </div>
        </div>
        <div v-else class="flex justify-between items-center text-sm">
          <span class="text-slate-500 text-xs">
            {{ dish.variants[0]?.label }}
            <span v-if="dish.variants[0]?.weight"> · {{ dish.variants[0].weight }} г</span>
          </span>
          <span class="font-bold text-slate-900">{{ dish.variants[0]?.price }} ₽</span>
        </div>

        <div class="flex items-center justify-between pt-1 border-t border-slate-100">
          <span class="text-xs text-slate-400">{{ category?.name ?? 'Без категории' }}</span>
          <div class="flex items-center gap-1">
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                class="sr-only peer"
                :checked="dish.isAvailable"
                @change="emit('toggleAvailability', dish.id)"
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
              @click="emit('edit', dish)"
            >
              <Pencil :size="14" />
            </button>
            <button
              class="p-1 text-slate-400 hover:text-red-500 transition-colors"
              @click="emit('remove', dish.id)"
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
