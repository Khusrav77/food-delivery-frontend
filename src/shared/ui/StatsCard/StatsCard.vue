<script setup lang="ts">
import { TrendingUp, TrendingDown } from 'lucide-vue-next'
import type { Component } from 'vue'

interface Props {
  label: string
  value: string
  trend?: number
  sub?: string
  icon: Component
  iconBg: string
  iconColor: string
}

const props = defineProps<Props>()

const trendPositive = props.trend !== undefined ? props.trend >= 0 : undefined
</script>

<template>
  <div class="bg-surface rounded-2xl p-5 border border-line hover:border-line-strong hover:shadow-[0_8px_24px_-14px_rgba(24,24,27,0.18)] transition-all">
    <div class="flex items-start justify-between mb-4">
      <div
        class="w-11 h-11 rounded-xl flex items-center justify-center"
        :class="iconBg"
      >
        <component :is="icon" :size="20" :class="iconColor" />
      </div>
      <div
        v-if="trend !== undefined"
        class="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
        :class="trendPositive
          ? 'bg-emerald-50 text-emerald-600'
          : 'bg-red-50 text-red-500'"
      >
        <TrendingUp v-if="trendPositive" :size="12" />
        <TrendingDown v-else :size="12" />
        {{ Math.abs(trend!) }}%
      </div>
    </div>
    <p class="font-display text-3xl font-semibold text-ink mb-0.5 tracking-tight">{{ value }}</p>
    <p class="text-sm text-muted">{{ label }}</p>
    <p v-if="sub" class="text-xs text-faint mt-1">{{ sub }}</p>
  </div>
</template>
