<script setup lang="ts">
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { User, MapPin, ShoppingBag, Star, Bell, Ticket, CreditCard, Users, LogOut, ChevronRight, MoreHorizontal } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/entities/user'
import { useNotificationStore } from '@/entities/notification'
import { useAuth } from '@/features/auth'

const { user, initials } = storeToRefs(useUserStore())
const notificationStore = useNotificationStore()
const { unreadCount } = storeToRefs(notificationStore)
const auth = useAuth()
const router = useRouter()
const route = useRoute()

const NAV = [
  { to: '/account/profile',       label: 'Профиль',      icon: User },
  { to: '/account/addresses',     label: 'Адреса',       icon: MapPin },
  { to: '/account/orders',        label: 'Заказы',       icon: ShoppingBag },
  { to: '/account/bonuses',       label: 'Бонусы',       icon: Star },
  { to: '/account/notifications', label: 'Уведомления',  icon: Bell },
  { to: '/account/promo',         label: 'Промокоды',    icon: Ticket },
  { to: '/account/cards',         label: 'Мои карты',    icon: CreditCard },
  { to: '/account/referral',      label: 'Реферальная',  icon: Users },
]

// Первые 4 всегда видны, остальные — под «Ещё»
const MOBILE_NAV_PRIMARY = NAV.slice(0, 4)
const MOBILE_NAV_EXTRA = NAV.slice(4)

const moreOpen = ref(false)

function isActive(to: string): boolean {
  return route.path.startsWith(to)
}

async function logout(): Promise<void> {
  await auth.logout()
  router.push('/')
}

onMounted(notificationStore.fetchAll)
</script>

<template>
  <!-- Desktop sidebar -->
  <aside class="hidden md:flex flex-col w-56 shrink-0">
    <!-- User card -->
    <div class="bg-surface rounded-2xl border border-line p-4 mb-3 flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-accent-soft border border-accent/20 flex items-center justify-center
                  text-accent text-sm font-bold shrink-0">
        {{ initials }}
      </div>
      <div class="min-w-0">
        <p class="text-sm font-semibold text-ink truncate">{{ user?.name }}</p>
        <p class="text-xs text-faint truncate">{{ user?.email ?? user?.phone }}</p>
      </div>
    </div>

    <!-- Nav -->
    <nav class="bg-surface rounded-2xl border border-line p-2 flex-1">
      <ul class="space-y-0.5">
        <li v-for="item in NAV" :key="item.to">
          <RouterLink
            :to="item.to"
            class="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
            :class="isActive(item.to)
              ? 'bg-accent-soft text-accent'
              : 'text-muted hover:bg-surface-soft hover:text-ink'"
          >
            <component
              :is="item.icon"
              :size="16"
              class="shrink-0 transition-colors"
              :class="isActive(item.to) ? 'text-accent' : 'text-faint group-hover:text-ink'"
            />
            <span class="flex-1">{{ item.label }}</span>
            <span
              v-if="item.to === '/account/notifications' && unreadCount > 0"
              class="min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-bold
                     flex items-center justify-center shrink-0"
            >
              {{ unreadCount }}
            </span>
            <ChevronRight v-else-if="isActive(item.to)" :size="13" class="text-accent/50" />
          </RouterLink>
        </li>
      </ul>

      <div class="mt-2 pt-2 border-t border-line">
        <button
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted
                 hover:text-red-500 hover:bg-red-50 transition-all
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/40"
          @click="logout"
        >
          <LogOut :size="16" class="shrink-0" />
          Выйти
        </button>
      </div>
    </nav>
  </aside>

  <!-- Mobile tab bar: 4 primary + «Ещё» -->
  <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-line">
    <div class="flex">
      <RouterLink
        v-for="item in MOBILE_NAV_PRIMARY"
        :key="item.to"
        :to="item.to"
        class="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors"
        :class="isActive(item.to) ? 'text-accent' : 'text-faint'"
      >
        <span class="relative">
          <component :is="item.icon" :size="22" />
          <span
            v-if="item.to === '/account/notifications' && unreadCount > 0"
            class="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-accent text-white
                   text-[9px] font-bold leading-none flex items-center justify-center"
          >{{ unreadCount }}</span>
        </span>
        {{ item.label }}
      </RouterLink>

      <!-- Ещё -->
      <button
        class="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors"
        :class="moreOpen ? 'text-accent' : 'text-faint'"
        @click="moreOpen = !moreOpen"
      >
        <MoreHorizontal :size="22" />
        Ещё
      </button>
    </div>

    <!-- Extra items dropdown -->
    <Transition name="slide-up">
      <div v-if="moreOpen" class="border-t border-line bg-surface grid grid-cols-2">
        <RouterLink
          v-for="item in MOBILE_NAV_EXTRA"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-colors"
          :class="isActive(item.to) ? 'text-accent' : 'text-muted hover:text-ink'"
          @click="moreOpen = false"
        >
          <component :is="item.icon" :size="18" class="shrink-0" :class="isActive(item.to) ? 'text-accent' : 'text-faint'" />
          {{ item.label }}
        </RouterLink>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active { transition: transform 0.2s ease, opacity 0.2s ease; }
.slide-up-enter-from,
.slide-up-leave-to { transform: translateY(100%); opacity: 0; }
</style>
