<script setup lang="ts">
import { computed } from 'vue'
import { Heart } from 'lucide-vue-next'
import { useFavoriteStore } from '@/entities/favorite'

const props = withDefaults(defineProps<{ productId: string; size?: number }>(), { size: 18 })

const store = useFavoriteStore()
const active = computed(() => store.isFavorite(props.productId))
</script>

<template>
  <button
    type="button"
    class="group/fav grid place-items-center rounded-full bg-surface/85 backdrop-blur-sm shadow-sm
           hover:bg-surface transition-colors duration-200 focus-visible:outline-none
           focus-visible:ring-2 focus-visible:ring-accent/50"
    :class="size >= 22 ? 'w-10 h-10' : 'w-9 h-9'"
    :aria-label="active ? 'Убрать из избранного' : 'Добавить в избранное'"
    :aria-pressed="active"
    @click.stop="store.toggle(productId)"
  >
    <Heart
      :size="size"
      class="transition-all duration-200 group-active/fav:scale-75"
      :class="active ? 'fill-red-500 text-red-500' : 'text-muted group-hover/fav:text-red-400'"
    />
  </button>
</template>
