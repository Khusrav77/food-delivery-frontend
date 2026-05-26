<script setup lang="ts">
import { onMounted } from 'vue'
import { PromoCarousel } from '@/widgets/promo-carousel'
import { CategoryStrip } from '@/widgets/category-strip'
import { ProductsSection } from '@/widgets/products-section'
import { LoyaltyBanner } from '@/widgets/loyalty-banner'
import { DishPreviewModal } from '@/widgets/dish-preview'
import { useHomePage } from './model/useHomePage'

const page = useHomePage()
onMounted(page.init)
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-8 pb-12">
    <PromoCarousel />
    <CategoryStrip v-model="page.activeCategoryId" />
    <ProductsSection
      :products="page.filteredProducts"
      :loading="page.loading"
      @select="page.openPreview"
    />
    <LoyaltyBanner />
  </main>
  <DishPreviewModal
    :product="page.selectedProduct"
    :show="page.selectedProduct !== null"
    @close="page.closePreview"
  />
</template>
