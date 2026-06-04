<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  ArrowLeft, ShoppingCart, Plus, Minus,
  Trash2, UtensilsCrossed, ArrowRight,
} from 'lucide-vue-next'
import { useCartStore } from '@/entities/cart'
import { formatPrice } from '@/shared/lib/money'

const router = useRouter()
const cart = useCartStore()
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-4 md:py-6">

    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <button
        class="w-9 h-9 rounded-full border border-line flex items-center justify-center
               text-muted hover:text-ink hover:bg-surface-soft transition-colors
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        aria-label="Назад"
        @click="router.back()"
      >
        <ArrowLeft :size="16" />
      </button>
      <div class="flex items-center gap-2">
        <ShoppingCart :size="20" class="text-accent" />
        <h1 class="font-display font-bold text-xl text-ink leading-none">Корзина</h1>
        <span
          v-if="cart.count > 0"
          class="flex items-center justify-center min-w-[22px] h-[22px] rounded-full
                 bg-accent text-white text-xs font-bold px-1 leading-none"
        >{{ cart.count }}</span>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="cart.isEmpty"
      class="flex flex-col items-center justify-center gap-5 py-20 text-center"
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
               hover:bg-accent-soft transition-colors
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        @click="router.push('/')"
      >
        В меню
      </button>
    </div>

    <!-- Cart content -->
    <template v-else>
      <!-- Items list -->
      <div class="space-y-3">
        <div
          v-for="item in cart.items"
          :key="item.menuItemId"
          class="flex gap-3 p-3 bg-surface rounded-2xl border border-line"
        >
          <!-- Image -->
          <div class="w-[68px] h-[68px] rounded-xl overflow-hidden shrink-0 bg-surface-soft flex items-center justify-center">
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.productName"
              loading="lazy"
              decoding="async"
              class="w-full h-full object-cover"
            />
            <UtensilsCrossed v-else :size="22" class="text-faint opacity-30" />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div class="pr-1">
              <p class="text-sm font-medium text-ink line-clamp-1">{{ item.productName }}</p>
              <p class="text-xs text-muted mt-0.5">{{ item.variantName }}</p>
            </div>
            <!-- Qty + price -->
            <div class="flex items-center justify-between mt-2">
              <div class="flex items-center gap-0.5 bg-surface-soft rounded-full border border-line p-0.5">
                <button
                  class="w-8 h-8 flex items-center justify-center rounded-full text-muted
                         hover:text-ink hover:bg-surface transition-colors
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  :aria-label="`Уменьшить ${item.productName}`"
                  @click="cart.updateQuantity(item.menuItemId, item.quantity - 1)"
                >
                  <Minus :size="13" />
                </button>
                <span class="text-sm font-semibold text-ink min-w-[22px] text-center leading-none select-none">
                  {{ item.quantity }}
                </span>
                <button
                  class="w-8 h-8 flex items-center justify-center rounded-full text-muted
                         hover:text-accent hover:bg-accent-soft transition-colors
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  :aria-label="`Увеличить ${item.productName}`"
                  @click="cart.updateQuantity(item.menuItemId, item.quantity + 1)"
                >
                  <Plus :size="13" />
                </button>
              </div>
              <span class="text-sm font-semibold text-ink">
                {{ formatPrice(item.price * item.quantity) }}
              </span>
            </div>
          </div>

          <!-- Remove -->
          <button
            class="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-faint self-start mt-0.5
                   hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            :aria-label="`Удалить ${item.productName}`"
            @click="cart.removeItem(item.menuItemId)"
          >
            <Trash2 :size="14" />
          </button>
        </div>
      </div>

      <!-- Sticky CTA — sticks above the floating mobile tab bar -->
      <div class="sticky bottom-24 md:bottom-0 z-20 mt-4 bg-canvas pt-2 pb-2">
        <div class="bg-surface border border-line rounded-2xl p-4 space-y-3 shadow-sm">
          <div class="flex items-center justify-between px-1">
            <span class="text-muted text-sm">Итого</span>
            <span class="font-display font-bold text-ink text-xl">{{ cart.formattedTotal }}</span>
          </div>
          <button
            class="w-full py-3.5 flex items-center justify-center gap-2
                   bg-accent hover:bg-accent-hover active:bg-orange-600
                   text-white font-semibold text-sm rounded-xl transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-1"
            @click="router.push('/checkout')"
          >
            Оформить заказ
            <ArrowRight :size="16" />
          </button>
          <button
            class="w-full py-1.5 text-xs text-faint hover:text-muted transition-colors text-center"
            @click="cart.clearCart()"
          >
            Очистить корзину
          </button>
        </div>
      </div>
    </template>

  </div>
</template>
