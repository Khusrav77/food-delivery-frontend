<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { usePromoCarousel } from '../model/usePromoCarousel'

const { activeIndex, slides, goTo, next, prev, pause, resume } = usePromoCarousel()
</script>

<template>
  <div
    class="relative overflow-hidden rounded-2xl shadow-md"
    @mouseenter="pause"
    @mouseleave="resume"
  >
    <!-- Slides track -->
    <div
      class="flex transition-transform duration-500 ease-in-out"
      :style="{ transform: `translateX(-${activeIndex * 100}%)` }"
    >
      <div
        v-for="slide in slides"
        :key="slide.id"
        class="min-w-full min-h-60 md:min-h-80 flex flex-col justify-center items-start px-8 md:px-14 py-10"
        :class="slide.bgClass"
      >
        <div class="text-5xl mb-4 select-none">{{ slide.emoji }}</div>
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
          {{ slide.title }}
        </h2>
        <p class="text-white/80 text-base md:text-lg mb-6">
          {{ slide.subtitle }}
        </p>
        <button class="bg-white text-slate-800 font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm">
          {{ slide.ctaLabel }}
        </button>
      </div>
    </div>

    <!-- Left arrow -->
    <button
      class="absolute left-3 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white rounded-full p-2 transition-colors"
      aria-label="Предыдущий слайд"
      @click="prev"
    >
      <ChevronLeft :size="20" />
    </button>

    <!-- Right arrow -->
    <button
      class="absolute right-3 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white rounded-full p-2 transition-colors"
      aria-label="Следующий слайд"
      @click="next"
    >
      <ChevronRight :size="20" />
    </button>

    <!-- Dot indicators -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
      <button
        v-for="(slide, i) in slides"
        :key="slide.id"
        class="h-2 rounded-full transition-all duration-300"
        :class="i === activeIndex ? 'bg-white w-6' : 'bg-white/50 w-2'"
        :aria-label="`Перейти к слайду ${i + 1}`"
        @click="goTo(i)"
      />
    </div>
  </div>
</template>
