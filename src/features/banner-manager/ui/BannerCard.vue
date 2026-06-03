<script setup lang="ts">
import { GripVertical, Pencil, Trash2, Eye, EyeOff } from 'lucide-vue-next'
import { resolveBannerImage, type IBanner } from '@/entities/banner'

defineProps<{ banner: IBanner }>()
const emit = defineEmits<{ edit: []; remove: []; toggle: [] }>()
</script>

<template>
  <div
    class="flex items-center gap-3 p-3 rounded-2xl border border-line bg-surface transition-colors"
    :class="banner.isActive ? '' : 'opacity-60'"
  >
    <!-- Drag handle -->
    <button
      class="drag-handle shrink-0 text-faint hover:text-ink cursor-grab active:cursor-grabbing touch-none p-1
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-lg"
      aria-label="Перетащить"
    >
      <GripVertical :size="18" />
    </button>

    <!-- Thumbnail -->
    <div class="relative w-28 h-16 rounded-xl overflow-hidden bg-canvas border border-line shrink-0">
      <img
        :src="resolveBannerImage(banner.image)"
        :alt="banner.title"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <span
        v-if="banner.badge"
        class="absolute top-1 right-1 bg-black/55 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full"
      >
        {{ banner.badge }}
      </span>
    </div>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <p class="font-semibold text-ink text-sm truncate">{{ banner.title || 'Без заголовка' }}</p>
        <span
          class="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border"
          :class="banner.isActive
            ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
            : 'text-muted bg-canvas border-line'"
        >
          {{ banner.isActive ? 'Активен' : 'Скрыт' }}
        </span>
      </div>
      <p v-if="banner.subtitle" class="text-xs text-faint truncate mt-0.5">{{ banner.subtitle }}</p>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-1 shrink-0">
      <button
        class="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-ink hover:bg-surface-soft
               transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        :aria-label="banner.isActive ? 'Скрыть' : 'Показать'"
        @click="emit('toggle')"
      >
        <component :is="banner.isActive ? Eye : EyeOff" :size="16" />
      </button>
      <button
        class="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-ink hover:bg-surface-soft
               transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        aria-label="Редактировать"
        @click="emit('edit')"
      >
        <Pencil :size="16" />
      </button>
      <button
        class="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-red-600 hover:bg-red-50
               transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
        aria-label="Удалить"
        @click="emit('remove')"
      >
        <Trash2 :size="16" />
      </button>
    </div>
  </div>
</template>
