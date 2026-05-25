<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { usePromoCarousel } from '../model/usePromoCarousel'

const { containerRef, slides, cardWidth, translateX, offset, maxOffset, prev, next } = usePromoCarousel()
</script>

<template>
  <div class="relative">
    <!-- Track container -->
    <div ref="containerRef" class="overflow-hidden">
      <div
        class="flex gap-4 transition-transform duration-300 ease-in-out"
        :style="{ transform: `translateX(-${translateX}px)` }"
      >
        <div
          v-for="slide in slides"
          :key="slide.id"
          class="flex-none h-60 md:h-72 rounded-2xl flex flex-col justify-between p-5 md:p-6 relative overflow-hidden"
          :class="slide.bgClass"
          :style="{ width: `${cardWidth}px` }"
        >
          <!-- Top row: emoji + badge -->
          <div class="flex items-start justify-between">
            <span class="text-4xl select-none leading-none">{{ slide.emoji }}</span>
            <span
              v-if="slide.badge"
              class="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full"
            >
              {{ slide.badge }}
            </span>
          </div>

          <!-- Bottom: text + cta -->
          <div>
            <h3 class="font-sans text-xl md:text-2xl font-extrabold text-white leading-snug mb-1">
              {{ slide.title }}
            </h3>
            <p class="text-white/65 text-xs md:text-sm mb-4">{{ slide.subtitle }}</p>
            <button
              class="bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            >
              {{ slide.ctaLabel }}
            </button>
          </div>
        </div>
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
  </div>
</template>
