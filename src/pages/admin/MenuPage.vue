<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Settings2, Tag as TagIcon, Search } from 'lucide-vue-next'
import { useProductStore, DishCard } from '../../entities/dish'
import type { Product } from '../../entities/dish'
import { useTagStore, TagBadge } from '../../entities/tag'
import { useCategoryStore } from '../../entities/category'
import { DishFormModal } from '../../features/dish-form'
import { CategoryManagerModal } from '../../features/category-manager'
import { TagManagerModal } from '../../features/tag-manager'

const productStore = useProductStore()
const tagStore = useTagStore()
const categoryStore = useCategoryStore()

onMounted(async () => {
  // Tags must load first — their labels are used to resolve tagIds when mapping products
  await tagStore.fetchAll()
  await Promise.all([categoryStore.fetchAll(), productStore.fetchAll()])
})

const search = ref('')
const activeCategoryId = ref<string | 'all' | 'none'>('all')
const activeTagIds = ref<string[]>([])

const showDishForm = ref(false)
const editingProduct = ref<Product | null>(null)
const showCategoryManager = ref(false)
const showTagManager = ref(false)

function openCreate() {
  editingProduct.value = null
  showDishForm.value = true
}

function openEdit(product: Product) {
  editingProduct.value = product
  showDishForm.value = true
}

function closeDishForm() {
  showDishForm.value = false
  editingProduct.value = null
}

function toggleTagFilter(id: string) {
  const idx = activeTagIds.value.indexOf(id)
  if (idx === -1) activeTagIds.value.push(id)
  else activeTagIds.value.splice(idx, 1)
}

const categoryCount = computed(() => {
  const map: Record<string, number> = {}
  for (const p of productStore.products) {
    const key = p.categoryId ?? '__none__'
    map[key] = (map[key] ?? 0) + 1
  }
  return map
})

const filteredProducts = computed(() => {
  let list = productStore.products

  if (activeCategoryId.value === 'none') {
    list = list.filter(p => p.categoryId === null)
  } else if (activeCategoryId.value !== 'all') {
    list = list.filter(p => p.categoryId === activeCategoryId.value)
  }

  if (activeTagIds.value.length > 0) {
    // продукт попадает если хотя бы один его menu_item имеет все выбранные теги
    list = list.filter(p =>
      activeTagIds.value.every(tid => p.menuItems.some(mi => mi.tagIds.includes(tid))),
    )
  }

  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    )
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
        <p class="text-slate-500 text-sm mt-0.5">{{ productStore.products.length }} блюд</p>
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
          activeCategoryId === 'all' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-100',
        ]"
        @click="activeCategoryId = 'all'"
      >
        Все <span class="ml-1 text-xs opacity-75">({{ productStore.products.length }})</span>
      </button>
      <button
        v-for="cat in categoryStore.categories"
        :key="cat.id"
        :class="[
          'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
          activeCategoryId === cat.id ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-100',
        ]"
        @click="activeCategoryId = cat.id"
      >
        {{ cat.name }}
        <span class="ml-1 text-xs opacity-75">({{ categoryCount[cat.id] ?? 0 }})</span>
      </button>
      <button
        :class="[
          'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
          activeCategoryId === 'none' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-100',
        ]"
        @click="activeCategoryId = 'none'"
      >
        Без категории
        <span class="ml-1 text-xs opacity-75">({{ categoryCount['__none__'] ?? 0 }})</span>
      </button>
    </div>

    <!-- Product grid -->
    <div v-if="filteredProducts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <DishCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        @edit="openEdit"
        @remove="productStore.removeProduct($event)"
        @toggle-active="productStore.toggleActive($event)"
      />
    </div>
    <div v-else class="flex flex-col items-center justify-center py-20 text-slate-400">
      <p class="text-lg">Блюда не найдены</p>
      <p class="text-sm mt-1">Попробуйте изменить фильтры или добавьте новое блюдо</p>
    </div>
  </div>

  <DishFormModal
    v-if="showDishForm"
    :product="editingProduct"
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
