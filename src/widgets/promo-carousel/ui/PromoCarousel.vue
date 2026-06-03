<script setup lang="ts">
import { useTemplateRef, type Component } from 'vue'
import { ChevronLeft, ChevronRight, Bike, Gift, Truck, ChefHat, Star } from 'lucide-vue-next'
import { usePromoCarousel } from '../model/usePromoCarousel'

const containerRef = useTemplateRef<HTMLElement>('containerRef')
const {
  slides, cardWidth, translateX, offset, maxOffset, visible,
  prev, next, onTouchStart, onTouchEnd,
} = usePromoCarousel(containerRef)

const iconMap: Record<string, Component> = { Bike, Gift, Truck, ChefHat, Star }
</script>

<template>
  <div class="relative">
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
        <div
          v-for="slide in slides"
          :key="slide.id"
          class="flex-none h-60 md:h-72 rounded-2xl flex flex-col justify-between p-5 md:p-6 relative overflow-hidden cursor-pointer"
          :class="slide.bgClass"
          :style="{ width: `${cardWidth}px` }"
        >
          <!-- Top row: icon + badge -->
          <div class="flex items-start justify-between">
            <component :is="iconMap[slide.icon]" :size="36" class="text-white/90" />
            <span
              v-if="slide.badge"
              class="bg-white/25 backdrop-blur-sm text-white text-xs font-extrabold px-3 py-1 rounded-full"
            >
              {{ slide.badge }}
            </span>
          </div>

          <!-- Bottom: text + cta -->
          <div>
            <h3 class="font-display text-xl md:text-2xl font-extrabold text-white leading-snug mb-1.5">
              {{ slide.title }}
            </h3>
            <p class="text-white/70 text-xs md:text-sm mb-4">{{ slide.subtitle }}</p>
            <button
              class="bg-white text-ink text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-white/90 transition-colors shadow-sm"
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
        @click="offset = i - 1"
      />
    </div>
  </div>
</template>
