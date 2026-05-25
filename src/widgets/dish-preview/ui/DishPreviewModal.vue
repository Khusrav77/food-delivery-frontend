<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { X, ShoppingCart } from 'lucide-vue-next'
import { type Product, formatItemLabel } from '@/entities/dish'
import { useDishPreview } from '../model/useDishPreview'

const props = defineProps<{ product: Product | null; show: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { selectedItem, activeItems, displayPrice, displayImage, selectItem } =
  useDishPreview(computed(() => props.product))

watch(() => props.show, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

function onBackdropClick(e: MouseEvent): void {
  if (e.target === e.currentTarget) emit('close')
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="show && product"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
        @click="onBackdropClick"
      >
        <Transition name="modal">
          <div
            v-if="show && product"
            class="bg-white w-full sm:max-w-lg sm:mx-4 rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
          >
            <!-- Image -->
            <div class="relative aspect-[4/3] bg-slate-100 shrink-0">
              <img
                v-if="displayImage"
                :src="displayImage"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center">
                <span class="text-8xl select-none">🍽️</span>
              </div>
              <button
                class="absolute top-4 right-4 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-colors"
                aria-label="Закрыть"
                @click="emit('close')"
              >
                <X :size="18" class="text-slate-600" />
              </button>
            </div>

            <!-- Scrollable content -->
            <div class="flex flex-col overflow-y-auto p-5 gap-4">

              <!-- Name + description -->
              <div>
                <h2 class="text-xl font-bold text-slate-900 leading-snug">{{ product.name }}</h2>
                <p v-if="product.description" class="mt-2 text-slate-500 text-sm leading-relaxed">
                  {{ product.description }}
                </p>
              </div>

              <!-- Variants (only if multiple) -->
              <div v-if="activeItems.length > 1" class="space-y-2.5">
                <p class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Выберите вариант</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="item in activeItems"
                    :key="item.id"
                    class="px-4 py-2 rounded-xl text-sm font-medium border transition-all"
                    :class="selectedItem?.id === item.id
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-orange-400 hover:text-orange-500'"
                    @click="selectItem(item)"
                  >
                    {{ formatItemLabel(item) }}
                  </button>
                </div>
              </div>

              <!-- Price + CTA -->
              <div class="flex items-center gap-3 pt-3 border-t border-slate-100">
                <span class="text-2xl font-bold text-slate-900 flex-1">{{ displayPrice }}</span>
                <button
                  class="flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  <ShoppingCart :size="18" />
                  В корзину
                </button>
              </div>

            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

.modal-enter-active,
.modal-leave-active { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease; }
.modal-enter-from,
.modal-leave-to { transform: translateY(1.5rem); opacity: 0; }
</style>
