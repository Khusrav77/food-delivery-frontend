<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { RouterLink } from 'vue-router'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { resolveBannerImage } from '@/entities/banner'
import { usePromoCarousel } from '../model/usePromoCarousel'

const containerRef = useTemplateRef<HTMLElement>('containerRef')
const {
  banners, cardWidth, translateX, offset, maxOffset,
  prev, next, goTo, onTouchStart, onTouchEnd, onMouseEnter, onMouseLeave,
} = usePromoCarousel(containerRef)
</script>

<template>
  <div v-if="banners.length" class="relative" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <!-- Track container -->
    <div
      ref="containerRef"
      class="overflow-hidden"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <div
        class="flex gap-4 transition-transform duration-300 ease-in-out"
        :style="{ transform: `translateX(-${translateX}px)` }"
      >
        <component
          :is="banner.href ? RouterLink : 'div'"
          v-for="banner in banners"
          :key="banner.id"
          :to="banner.href || undefined"
          class="flex-none h-60 md:h-72 rounded-2xl relative overflow-hidden cursor-pointer bg-line group"
          :style="{ width: `${cardWidth}px` }"
        >
          <!-- Background image -->
          <img
            :src="resolveBannerImage(banner.image)"
            :alt="banner.title"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          <!-- Readability scrim (only when there is text) -->
          <div
            v-if="banner.showOverlay"
            class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
          />

          <!-- Badge -->
          <span
            v-if="banner.badge"
            class="absolute top-4 right-4 bg-white/25 backdrop-blur-sm text-white text-xs font-extrabold px-3 py-1 rounded-full z-10"
          >
            {{ banner.badge }}
          </span>

          <!-- Text overlay -->
          <div
            v-if="banner.showOverlay"
            class="absolute inset-x-0 bottom-0 p-5 md:p-6 z-10"
          >
            <h3 class="font-display text-xl md:text-2xl font-extrabold text-white leading-snug mb-1.5">
              {{ banner.title }}
            </h3>
            <p v-if="banner.subtitle" class="text-white/80 text-xs md:text-sm mb-4">
              {{ banner.subtitle }}
            </p>
            <span
              v-if="banner.ctaLabel"
              class="inline-block bg-surface text-ink text-xs font-bold px-5 py-2.5 rounded-lg group-hover:bg-surface-soft transition-colors shadow-sm"
            >
              {{ banner.ctaLabel }}
            </span>
          </div>
        </component>
      </div>
    </div>

    <!-- Left arrow -->
    <button
      v-if="offset > 0"
      class="absolute left-2 top-1/2 -translate-y-1/2 bg-surface/90 shadow-md hover:bg-surface border border-line text-ink rounded-full p-2.5 transition-all z-10"
      aria-label="Назад"
      @click="prev"
    >
      <ChevronLeft :size="18" />
    </button>

    <!-- Right arrow -->
    <button
      v-if="offset < maxOffset"
      class="absolute right-2 top-1/2 -translate-y-1/2 bg-surface/90 shadow-md hover:bg-surface border border-line text-ink rounded-full p-2.5 transition-all z-10"
      aria-label="Вперёд"
      @click="next"
    >
      <ChevronRight :size="18" />
    </button>

    <!-- Dot indicators -->
    <div
      v-if="maxOffset > 0"
      class="flex justify-center gap-2 mt-4"
      aria-hidden="true"
    >
      <button
        v-for="i in maxOffset + 1"
        :key="i"
        class="rounded-full transition-all duration-200"
        :class="i - 1 === offset ? 'w-5 h-2 bg-accent' : 'w-2 h-2 bg-line-strong hover:bg-muted'"
        :aria-label="`Слайд ${i}`"
        @click="goTo(i - 1)"
      />
    </div>
  </div>
</template>
