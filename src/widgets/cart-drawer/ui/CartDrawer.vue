<script setup lang="ts">
import { X, ShoppingCart, Plus, Minus, Trash2, UtensilsCrossed, ArrowRight } from 'lucide-vue-next'
import { useCartStore } from '@/entities/cart'
import { formatPrice } from '@/shared/lib/money'

const cart = useCartStore()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="cart.isOpen"
        class="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm"
        @click="cart.close()"
      />
    </Transition>

    <Transition name="slide">
      <aside
        v-if="cart.isOpen"
        class="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[400px] bg-surface shadow-2xl flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
          <div class="flex items-center gap-2.5">
            <ShoppingCart :size="18" class="text-accent" />
            <h2 class="font-display font-semibold text-ink text-lg leading-none">Корзина</h2>
            <span
              v-if="cart.count > 0"
              class="flex items-center justify-center min-w-[22px] h-[22px] rounded-full
                     bg-accent text-white text-xs font-bold px-1 leading-none"
            >{{ cart.count }}</span>
          </div>
          <button
            class="w-9 h-9 flex items-center justify-center rounded-full text-muted
                   hover:text-ink hover:bg-surface-soft transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            aria-label="Закрыть корзину"
            @click="cart.close()"
          >
            <X :size="18" />
          </button>
        </div>

        <!-- Empty state -->
        <div
          v-if="cart.isEmpty"
          class="flex-1 flex flex-col items-center justify-center gap-5 px-8 text-center"
        >
          <div class="w-24 h-24 rounded-full bg-surface-soft flex items-center justify-center">
            <UtensilsCrossed :size="36" class="text-faint opacity-30" />
          </div>
          <div>
            <p class="font-display font-semibold text-ink text-lg">Корзина пуста</p>
            <p class="text-sm text-muted mt-1.5 leading-relaxed">
              Добавьте блюда из меню,<br />чтобы сделать заказ
            </p>
          </div>
          <button
            class="px-5 py-2.5 rounded-full border border-accent text-accent text-sm font-medium
                   hover:bg-accent-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            @click="cart.close()"
          >
            Вернуться в меню
          </button>
        </div>

        <!-- Items list -->
        <div v-else class="flex-1 overflow-y-auto p-4 space-y-3">
          <div
            v-for="item in cart.items"
            :key="item.menuItemId"
            class="flex gap-3 p-3 bg-surface-soft rounded-2xl group/item"
          >
            <!-- Image -->
            <div class="w-[68px] h-[68px] rounded-xl overflow-hidden shrink-0 bg-line flex items-center justify-center">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.productName"
                class="w-full h-full object-cover"
              />
              <UtensilsCrossed v-else :size="22" class="text-faint opacity-30" />
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div class="pr-1">
                <p class="text-sm font-medium text-ink line-clamp-1">{{ item.productName }}</p>
                <p class="text-xs text-muted mt-0.5 line-clamp-1">{{ item.variantName }}</p>
              </div>

              <!-- Qty + price -->
              <div class="flex items-center justify-between mt-2">
                <div class="flex items-center gap-1.5 bg-surface rounded-lg border border-line p-0.5">
                  <button
                    class="w-7 h-7 flex items-center justify-center rounded-md text-muted
                           hover:text-ink hover:bg-surface-soft transition-colors"
                    :aria-label="`Уменьшить количество ${item.productName}`"
                    @click="cart.updateQuantity(item.menuItemId, item.quantity - 1)"
                  >
                    <Minus :size="12" />
                  </button>
                  <span class="text-sm font-semibold text-ink min-w-[18px] text-center leading-none select-none">
                    {{ item.quantity }}
                  </span>
                  <button
                    class="w-7 h-7 flex items-center justify-center rounded-md text-muted
                           hover:text-accent hover:bg-accent-soft transition-colors"
                    :aria-label="`Увеличить количество ${item.productName}`"
                    @click="cart.updateQuantity(item.menuItemId, item.quantity + 1)"
                  >
                    <Plus :size="12" />
                  </button>
                </div>
                <span class="text-sm font-semibold text-ink">
                  {{ formatPrice(item.price * item.quantity) }}
                </span>
              </div>
            </div>

            <!-- Remove -->
            <button
              class="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-faint self-start mt-0.5
                     hover:text-red-500 hover:bg-red-50 transition-colors
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
              :aria-label="`Удалить ${item.productName} из корзины`"
              @click="cart.removeItem(item.menuItemId)"
            >
              <Trash2 :size="13" />
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="!cart.isEmpty" class="px-4 pt-3 pb-5 border-t border-line shrink-0 space-y-3">
          <div class="flex items-center justify-between px-1">
            <span class="text-muted text-sm">Итого</span>
            <span class="font-display font-bold text-ink text-xl">{{ cart.formattedTotal }}</span>
          </div>
          <button
            class="w-full py-3.5 flex items-center justify-center gap-2
                   bg-accent hover:bg-accent-hover active:bg-orange-600
                   text-white font-semibold text-sm rounded-xl transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-1"
          >
            Оформить заказ
            <ArrowRight :size="16" />
          </button>
          <button
            class="w-full py-2 text-xs text-faint hover:text-muted transition-colors text-center"
            @click="cart.clearCart()"
          >
            Очистить корзину
          </button>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

.slide-enter-active,
.slide-leave-active { transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1); }
.slide-enter-from,
.slide-leave-to { transform: translateX(100%); }
</style>
