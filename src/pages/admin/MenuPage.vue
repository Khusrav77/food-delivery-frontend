<script setup lang="ts">
import { onMounted } from 'vue'

import { useMenuPage } from './model/useMenuPage'

import MenuHeader from '@/widgets/menu/MenuHeader.vue'
import ProductFilters from '@/widgets/menu/ProductFilters.vue'
import CategoryTabs from '@/widgets/menu/CategoryTabs.vue'
import ProductGrid from '@/widgets/menu/ProductGrid.vue'
import EmptyProducts from '@/widgets/menu/EmptyProducts.vue'

import { DishFormModal } from '@/features/product-form'
import { CategoryManagerModal } from '@/features/category-manager'
import { TagManagerModal } from '@/features/tag-manager'

const menu = useMenuPage()

onMounted(menu.init)
</script>

<template>
  <div class="p-6 space-y-4">

    <MenuHeader
      :count="menu.products.length"
      @create="menu.openCreate"
      @categories="menu.openCategories"
      @tags="menu.openTags"
    />

    <ProductFilters
      v-model:search="menu.search"
      v-model:activeTagIds="menu.activeTagIds"
    />

    <CategoryTabs v-model="menu.activeCategoryId" />

    <p
      v-if="menu.filteredProducts.length && !menu.canSort"
      class="text-xs text-faint"
    >
      Выберите конкретную категорию (без поиска и фильтра по тегам), чтобы менять порядок блюд перетаскиванием.
    </p>

    <ProductGrid
      v-if="menu.filteredProducts.length"
      :products="menu.filteredProducts"
      :sortable="menu.canSort"
      @edit="menu.openEdit"
    />

    <EmptyProducts v-else />

    <DishFormModal
      v-if="menu.showDishForm"
      :product="menu.editingProduct"
      @close="menu.closeDishForm"
    />

    <CategoryManagerModal
      v-if="menu.showCategoryManager"
      @close="menu.closeCategories"
    />

    <TagManagerModal
      v-if="menu.showTagManager"
      @close="menu.closeTags"
    />

  </div>
</template>
