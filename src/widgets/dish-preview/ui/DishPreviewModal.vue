<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { X, ShoppingCart } from 'lucide-vue-next'
import { type Product, formatItemLabel } from '@/entities/dish'
import { useCartStore } from '@/entities/cart'
import { useToastStore } from '@/shared/lib/toast'
import { flyToCart } from '@/features/fly-to-cart'
import { useDishPreview } from '../model/useDishPreview'

const props = defineProps<{ product: Product | null; show: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { selectedItem, activeItems, displayPrice, displayImage, selectItem } =
  useDishPreview(computed(() => props.product))

const cart = useCartStore()
const toast = useToastStore()
const imgEl = ref<HTMLImageElement | null>(null)

watch(() => props.show, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

function addToCart(): void {
  if (!selectedItem.value || !props.product) return
  cart.addItem({
    menuItemId: selectedItem.value.id,
    productId: props.product.id,
    productName: props.product.name,
    variantName: formatItemLabel(selectedItem.value),
    price: selectedItem.value.price,
    image: displayImage.value,
  })
  flyToCart(imgEl.value, displayImage.value)
  toast.success(`${props.product.name} добавлен в корзину`)
  emit('close')
}

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
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 backdrop-blur-sm"
        @click="onBackdropClick"
      >
        <Transition name="modal">
          <div
            v-if="show && product"
            class="bg-surface w-full sm:max-w-2xl sm:mx-4 rounded-t-3xl sm:rounded-2xl overflow-hidden
                   shadow-2xl shadow-black/15 max-h-[92vh] sm:max-h-[82vh]
                   flex flex-col sm:flex-row"
          >

            <!-- Image: top on mobile, left on desktop -->
            <div class="relative aspect-[4/3] sm:aspect-auto sm:w-[44%] shrink-0 bg-surface">
              <img
                v-if="displayImage"
                ref="imgEl"
                :src="displayImage"
                :alt="product.name"
                loading="lazy"
                decoding="async"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <span class="text-8xl select-none opacity-25">🍽️</span>
              </div>

              <!-- Close -->
              <button
                class="absolute top-4 right-4 w-9 h-9 bg-surface/85 hover:bg-surface backdrop-blur-sm
                       rounded-full flex items-center justify-center shadow-sm transition-colors"
                aria-label="Закрыть"
                @click="emit('close')"
              >
                <X :size="18" class="text-ink" />
              </button>
            </div>

            <!-- Content: scrollable -->
            <div class="flex flex-col overflow-y-auto flex-1 p-5 sm:p-6 gap-4">

              <!-- Name + description -->
              <div class="flex-1">
                <h2 class="font-display text-2xl font-semibold text-ink leading-tight tracking-tight">{{ product.name }}</h2>
                <p v-if="product.description" class="mt-3 text-muted text-sm leading-relaxed">
                  {{ product.description }}
                </p>
              </div>

              <!-- Variants -->
              <div v-if="activeItems.length > 1" class="space-y-2.5">
                <p class="text-xs font-semibold text-faint uppercase tracking-[0.15em]">Выберите вариант</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="item in activeItems"
                    :key="item.id"
                    class="px-4 py-2 rounded-lg text-sm font-medium border transition-all"
                    :class="selectedItem?.id === item.id
                      ? 'bg-accent text-white border-accent'
                      : 'bg-surface-soft text-muted border-line hover:border-accent hover:text-accent'"
                    @click="selectItem(item)"
                  >
                    {{ formatItemLabel(item) }}
                  </button>
                </div>
              </div>

              <!-- Price + CTA -->
              <div class="flex items-center gap-3 pt-4 border-t border-line mt-auto">
                <span class="font-display text-2xl font-semibold text-ink flex-1">{{ displayPrice }}</span>
                <button
                  class="flex items-center gap-2 px-5 py-3
                         bg-accent hover:bg-accent-hover active:bg-emerald-900
                         text-white font-medium rounded-lg transition-colors
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                  @click="addToCart()"
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
