<script setup lang="ts">
import { Pencil, Trash2, UtensilsCrossed, GripVertical } from 'lucide-vue-next'
import { type Product } from '@/entities/dish'
import { useDishCard } from '../model/useDishCard'
import CardTagList from './CardTagList.vue'

const props = defineProps<{ product: Product; draggableHandle?: boolean }>()
const emit = defineEmits<{
  edit: [product: Product]
  remove: [id: string]
  toggleActive: [id: string]
}>()

const { gallery, sizeParts, tags, isMulti, variantCount, priceLabel, showFrom } = useDishCard(props.product)
</script>

<template>
  <article
    class="group bg-surface rounded-3xl border overflow-hidden flex flex-col transition-all duration-300"
    :class="product.isActive
      ? 'border-line hover:border-accent/30 hover:shadow-[0_16px_40px_-12px_rgba(251,146,60,0.25)] hover:-translate-y-0.5'
      : 'border-line opacity-55'"
  >
    <!-- Gallery — inset -->
    <div class="px-3 pt-3">
      <div
        class="relative aspect-[4/3] overflow-hidden shrink-0 bg-surface-soft rounded-2xl"
        @mousemove="gallery.onHoverMove"
        @mouseleave="gallery.reset"
      >
        <img
          v-if="gallery.current"
          :src="gallery.current"
          :alt="product.name"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div v-else class="w-full h-full grid place-items-center">
          <UtensilsCrossed :size="52" class="text-faint opacity-30" />
        </div>

        <!-- Tags -->
        <div v-if="tags.length" class="absolute top-2.5 left-2.5 max-w-[72%]">
          <CardTagList :tags="tags" variant="overlay" />
        </div>

        <!-- Drag handle (sort mode only) -->
        <button
          v-if="draggableHandle"
          type="button"
          class="dish-drag-handle absolute top-2.5 right-2.5 z-10 grid place-items-center w-8 h-8 rounded-lg
                 bg-white/85 backdrop-blur-sm text-muted shadow-sm transition-colors
                 cursor-grab active:cursor-grabbing hover:text-accent
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          aria-label="Перетащить блюдо"
          @click.stop
        >
          <GripVertical :size="16" />
        </button>

        <!-- Inactive overlay -->
        <div
          v-if="!product.isActive"
          class="absolute inset-0 bg-muted/20 flex items-center justify-center"
        >
          <span class="bg-muted/70 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-lg">
            Недоступно
          </span>
        </div>

        <!-- Gallery dots -->
        <div v-if="gallery.hasGallery" class="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
          <span
            v-for="(_, i) in gallery.count"
            :key="i"
            class="h-1.5 rounded-full transition-all duration-200"
            :class="i === gallery.index ? 'w-5 bg-white' : 'w-1.5 bg-white/55'"
          />
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col flex-1 gap-2.5">
      <h3 class="font-medium text-ink line-clamp-2 leading-snug text-[15px]">{{ product.name }}</h3>

      <!-- Size chips -->
      <div v-if="sizeParts.length || isMulti" class="flex flex-wrap items-center gap-1.5">
        <span
          v-for="part in sizeParts"
          :key="part"
          class="inline-flex items-center rounded-md bg-surface-soft text-muted text-xs font-medium px-2 py-1 leading-none"
        >{{ part }}</span>
        <span
          v-if="isMulti"
          class="inline-flex items-center rounded-md bg-accent/10 text-accent text-xs font-semibold px-2 py-1 leading-none"
        >{{ variantCount }} варианта</span>
      </div>

      <p v-if="product.description" class="text-muted text-sm line-clamp-2 leading-relaxed flex-1">
        {{ product.description }}
      </p>
      <div v-else class="flex-1" />

      <!-- Price + Admin actions -->
      <div class="flex items-center justify-between mt-1">
        <div>
          <p v-if="showFrom" class="text-xs text-faint leading-none mb-1">от</p>
          <span class="font-display text-ink font-semibold text-xl leading-none">{{ priceLabel }}</span>
        </div>

        <div class="flex items-center gap-0.5">
          <!-- Active toggle -->
          <label
            class="relative inline-flex items-center cursor-pointer mr-1"
            :title="product.isActive ? 'Скрыть' : 'Показать'"
          >
            <input
              type="checkbox"
              class="sr-only peer"
              :checked="product.isActive"
              @change="emit('toggleActive', product.id)"
            />
            <div
              class="w-9 h-5 bg-line-strong peer-checked:bg-accent rounded-full transition-colors
                     after:content-[''] after:absolute after:top-0.5 after:left-0.5
                     after:bg-white after:rounded-full after:w-4 after:h-4
                     after:transition-all peer-checked:after:translate-x-4"
            />
          </label>

          <button
            type="button"
            class="p-2 rounded-xl text-muted hover:text-accent hover:bg-accent-soft transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            aria-label="Редактировать"
            @click.stop="emit('edit', product)"
          >
            <Pencil :size="15" />
          </button>

          <button
            type="button"
            class="p-2 rounded-xl text-muted hover:text-red-500 hover:bg-red-50 transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            aria-label="Удалить"
            @click.stop="emit('remove', product.id)"
          >
            <Trash2 :size="15" />
          </button>
        </div>
      </div>
    </div>
  </article>
</template>
