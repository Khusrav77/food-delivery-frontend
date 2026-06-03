<script setup lang="ts">
import { onMounted } from 'vue'
import { PromoCarousel } from '@/widgets/promo-carousel'
import { CategoryStrip } from '@/widgets/category-strip'
import { ProductsSection } from '@/widgets/products-section'
import { LoyaltyBanner } from '@/widgets/loyalty-banner'
import { DishPreviewModal } from '@/widgets/dish-preview'
import { BackToTop } from '@/shared/ui/BackToTop'
import { useHomePage } from './model/useHomePage'

const page = useHomePage()
onMounted(page.init)
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-16">
    <PromoCarousel />

    <div class="mt-8 mb-0 flex items-center gap-5">
      <h2 class="font-display text-3xl md:text-4xl font-extrabold text-ink tracking-tight shrink-0">
        Доставка еды
      </h2>
      <div class="flex-1 h-px bg-line" />
    </div>

    <CategoryStrip
      :categories="page.sections"
      :active-id="page.activeCategoryId"
      :loading="page.loading"
      @select="page.scrollToCategory"
    />

    <ProductsSection
      :sections="page.sections"
      :loading="page.loading"
      @select="page.openPreview"
    />

    <div class="mt-12">
      <LoyaltyBanner />
    </div>
  </main>

  <BackToTop />

  <DishPreviewModal
    :product="page.selectedProduct"
    :show="page.selectedProduct !== null"
    @close="page.closePreview"
  />
</template>
