<script setup lang="ts">
import { RouterLink } from 'vue-router'
import {
  MapPin, ChevronDown, Search, ShoppingCart,
  Heart, User, Star, UtensilsCrossed,
} from 'lucide-vue-next'
import { usePublicHeader } from '../model/usePublicHeader'
import { LocationPickerModal } from '@/features/location-picker'
import { ThemeToggle } from '@/features/theme-toggle'

const {
  isAuthenticated, user, initials,
  cartCount, cartTotal, favoritesCount,
  locationLabel, hasLocation, pickerOpen, openPicker, closePicker,
  openCart, goToLogin, goToAccount, goToBonuses, goToFavorites, goToSearch,
} = usePublicHeader()
</script>

<template>
  <header class="sticky top-3 z-50 px-3 md:px-5">
    <div
      class="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center gap-3 md:gap-4 lg:gap-5
             rounded-full border border-line bg-surface/70 backdrop-blur-md
             shadow-[0_10px_30px_-6px_rgba(0,0,0,0.18)]"
    >

      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2.5 shrink-0">
        <div class="w-9 h-9 rounded-md bg-accent flex items-center justify-center shadow-sm">
          <UtensilsCrossed :size="16" class="text-white" />
        </div>
        <span class="font-display font-bold text-ink text-xl leading-none tracking-tight">FoodHub</span>
      </RouterLink>

      <!-- Location -->
      <button
        class="hidden md:flex flex-col items-start gap-0.5 pl-4 border-l border-line shrink-0 group max-w-[220px]"
        aria-label="Выбрать город и адрес доставки"
        @click="openPicker()"
      >
        <span class="flex items-center gap-1 text-[13px] font-semibold text-ink group-hover:text-accent transition-colors leading-none">
          <MapPin :size="12" class="text-accent shrink-0" />
          <span class="truncate max-w-[170px]">{{ hasLocation ? locationLabel : 'Выбрать город' }}</span>
          <ChevronDown :size="11" class="text-faint group-hover:text-accent transition-colors shrink-0" />
        </span>
        <span class="text-[11px] text-faint leading-none pl-[17px]">
          Доставка ·
          <span class="text-accent hover:text-accent-hover transition-colors">
            {{ hasLocation ? 'Изменить адрес ›' : 'Указать адрес ›' }}
          </span>
        </span>
      </button>

      <div class="flex-1" />

      <!-- Nav -->
      <nav class="hidden lg:flex items-center gap-0.5">
        <a
          href="#"
          class="px-3 py-1.5 text-sm font-medium text-muted hover:text-ink hover:bg-surface-soft rounded-lg transition-colors"
        >Акции</a>
      </nav>

      <!-- Search -->
      <button
        class="w-9 h-9 rounded-full border border-line-strong flex items-center justify-center text-muted hover:text-ink hover:border-ink/30 hover:bg-surface-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        aria-label="Поиск"
        @click="goToSearch()"
      >
        <Search :size="15" />
      </button>

      <!-- Theme toggle -->
      <ThemeToggle area="client" />

      <!-- Guest: Войти + Бонусы -->
      <template v-if="!isAuthenticated">
        <button
          class="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-ink border border-line-strong rounded-full hover:border-ink/30 hover:bg-surface-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          @click="goToLogin()"
        >
          <User :size="14" class="text-muted" />
          Войти
        </button>
        <button
          class="hidden md:flex items-center px-3.5 py-1.5 text-sm font-semibold text-accent bg-accent-soft rounded-full hover:bg-accent/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          @click="goToLogin()"
        >
          Бонусы
        </button>
      </template>

      <!-- Authed: избранное + аватар + бонус-баланс -->
      <template v-else>
        <button
          class="relative hidden md:flex w-9 h-9 rounded-full border border-line-strong items-center justify-center text-muted hover:text-accent hover:border-accent/30 hover:bg-accent-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          aria-label="Избранное"
          @click="goToFavorites"
        >
          <Heart :size="15" />
          <span
            v-if="favoritesCount > 0"
            class="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center px-1 leading-none"
          >{{ favoritesCount }}</span>
        </button>

        <button
          class="hidden md:flex w-9 h-9 rounded-full bg-accent-soft border border-accent/25 items-center justify-center text-accent text-[13px] font-bold hover:bg-accent/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          :title="`${user?.name} — личный кабинет`"
          @click="goToAccount()"
        >
          {{ initials }}
        </button>

        <button
          v-if="user && user.bonusBalance !== undefined"
          class="hidden md:flex items-center gap-1 px-3 py-1.5 bg-accent-soft rounded-full text-sm font-semibold text-accent hover:bg-accent/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          @click="goToBonuses()"
        >
          <Star :size="12" class="fill-accent text-accent" />
          {{ user.bonusBalance }}
        </button>
      </template>

      <!-- Mobile profile / login (cart lives in the bottom tab bar on mobile) -->
      <button
        v-if="isAuthenticated"
        class="flex md:hidden w-9 h-9 rounded-full bg-accent-soft border border-accent/25 items-center justify-center text-accent text-[13px] font-bold hover:bg-accent/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 shrink-0"
        :aria-label="`${user?.name ?? 'Профиль'} — личный кабинет`"
        @click="goToAccount()"
      >
        {{ initials }}
      </button>
      <button
        v-else
        class="flex md:hidden w-9 h-9 rounded-full border border-line-strong items-center justify-center text-muted hover:text-ink hover:border-ink/30 hover:bg-surface-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 shrink-0"
        aria-label="Войти"
        @click="goToLogin()"
      >
        <User :size="16" />
      </button>

      <!-- Cart (desktop only — mobile uses the tab bar) -->
      <button
        data-fly-cart-target
        class="hidden md:flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-full transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-1 shrink-0"
        aria-label="Открыть корзину"
        @click="openCart()"
      >
        <ShoppingCart :size="15" />
        <template v-if="!isAuthenticated">
          {{ cartTotal }}
        </template>
        <template v-else>
          Корзина
          <span
            v-if="cartCount > 0"
            class="flex items-center justify-center min-w-[20px] h-5 rounded-full bg-white/25 text-xs font-bold px-1 leading-none"
          >{{ cartCount }}</span>
        </template>
      </button>

    </div>

    <LocationPickerModal v-if="pickerOpen" @close="closePicker()" />
  </header>
</template>
