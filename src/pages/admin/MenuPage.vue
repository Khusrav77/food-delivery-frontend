<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Settings2, Tag as TagIcon, Search } from 'lucide-vue-next'
import { useDishStore, DishCard } from '../../entities/dish'
import type { Dish } from '../../entities/dish'
import { useTagStore, TagBadge } from '../../entities/tag'
import { useCategoryStore } from '../../entities/category'
import { DishFormModal } from '../../features/dish-form'
import { CategoryManagerModal } from '../../features/category-manager'
import { TagManagerModal } from '../../features/tag-manager'

const dishStore = useDishStore()
const tagStore = useTagStore()
const categoryStore = useCategoryStore()

const search = ref('')
const activeCategoryId = ref<string | 'all' | 'none'>('all')
const activeTagIds = ref<string[]>([])

const showDishForm = ref(false)
const editingDish = ref<Dish | null>(null)
const showCategoryManager = ref(false)
const showTagManager = ref(false)

function openCreate() {
  editingDish.value = null
  showDishForm.value = true
}

function openEdit(dish: Dish) {
  editingDish.value = dish
  showDishForm.value = true
}

function closeDishForm() {
  showDishForm.value = false
  editingDish.value = null
}

function toggleTagFilter(id: string) {
  const idx = activeTagIds.value.indexOf(id)
  if (idx === -1) activeTagIds.value.push(id)
  else activeTagIds.value.splice(idx, 1)
}

const categoryCount = computed(() => {
  const map: Record<string, number> = {}
  for (const d of dishStore.dishes) {
    const key = d.categoryId ?? '__none__'
    map[key] = (map[key] ?? 0) + 1
  }
  return map
})

const filteredDishes = computed(() => {
  let list = dishStore.dishes

  if (activeCategoryId.value === 'none') {
    list = list.filter(d => d.categoryId === null)
  } else if (activeCategoryId.value !== 'all') {
    list = list.filter(d => d.categoryId === activeCategoryId.value)
  }

  if (activeTagIds.value.length > 0) {
    list = list.filter(d => activeTagIds.value.every(tid => d.tagIds.includes(tid)))
  }

  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    list = list.filter(d => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q))
  }

  return list
})
</script>

<template>
  <div class="p-6 space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Меню</h1>
        <p class="text-slate-500 text-sm mt-0.5">{{ dishStore.dishes.length }} блюд</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          @click="showCategoryManager = true"
        >
          <Settings2 :size="15" />
          Категории
        </button>
        <button
          class="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          @click="showTagManager = true"
        >
          <TagIcon :size="15" />
          Теги
        </button>
        <button
          class="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
          @click="openCreate"
        >
          <Plus :size="16" />
          Добавить блюдо
        </button>
      </div>
    </div>

    <!-- Search + tag filters -->
    <div class="flex flex-wrap items-center gap-2">
      <div class="relative">
        <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          v-model="search"
          type="text"
          placeholder="Поиск..."
          class="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-52"
        />
      </div>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="tag in tagStore.tags"
          :key="tag.id"
          type="button"
          class="transition-all"
          :class="activeTagIds.includes(tag.id) ? 'ring-2 ring-orange-400 ring-offset-1 rounded-full' : 'opacity-60 hover:opacity-100'"
          @click="toggleTagFilter(tag.id)"
        >
          <TagBadge :tag="tag" />
        </button>
      </div>
    </div>

    <!-- Category tabs -->
    <div class="flex gap-1 flex-wrap">
      <button
        :class="[
          'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
          activeCategoryId === 'all'
            ? 'bg-orange-500 text-white'
            : 'text-slate-600 hover:bg-slate-100',
        ]"
        @click="activeCategoryId = 'all'"
      >
        Все
        <span class="ml-1 text-xs opacity-75">({{ dishStore.dishes.length }})</span>
      </button>
      <button
        v-for="cat in categoryStore.categories"
        :key="cat.id"
        :class="[
          'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
          activeCategoryId === cat.id
            ? 'bg-orange-500 text-white'
            : 'text-slate-600 hover:bg-slate-100',
        ]"
        @click="activeCategoryId = cat.id"
      >
        {{ cat.name }}
        <span class="ml-1 text-xs opacity-75">({{ categoryCount[cat.id] ?? 0 }})</span>
      </button>
      <button
        :class="[
          'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
          activeCategoryId === 'none'
            ? 'bg-orange-500 text-white'
            : 'text-slate-600 hover:bg-slate-100',
        ]"
        @click="activeCategoryId = 'none'"
      >
        Без категории
        <span class="ml-1 text-xs opacity-75">({{ categoryCount['__none__'] ?? 0 }})</span>
      </button>
    </div>

    <!-- Dish grid -->
    <div v-if="filteredDishes.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <DishCard
        v-for="dish in filteredDishes"
        :key="dish.id"
        :dish="dish"
        @edit="openEdit"
        @remove="dishStore.removeDish($event)"
        @toggle-availability="dishStore.toggleAvailability($event)"
      />
    </div>
    <div v-else class="flex flex-col items-center justify-center py-20 text-slate-400">
      <p class="text-lg">Блюда не найдены</p>
      <p class="text-sm mt-1">Попробуйте изменить фильтры или добавьте новое блюдо</p>
    </div>
  </div>

  <!-- Modals -->
  <DishFormModal
    v-if="showDishForm"
    :dish="editingDish"
    @close="closeDishForm"
  />
  <CategoryManagerModal
    v-if="showCategoryManager"
    @close="showCategoryManager = false"
  />
  <TagManagerModal
    v-if="showTagManager"
    @close="showTagManager = false"
  />
</template>
