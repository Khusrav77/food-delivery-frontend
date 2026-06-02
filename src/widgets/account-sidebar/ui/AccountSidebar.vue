<script setup lang="ts">
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { User, MapPin, ShoppingBag, Star, LogOut, ChevronRight } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/entities/user'
import { useAuth } from '@/features/auth'

const { user, initials } = storeToRefs(useUserStore())
const auth = useAuth()
const router = useRouter()
const route = useRoute()

const NAV = [
  { to: '/account/profile',   label: 'Профиль',   icon: User },
  { to: '/account/addresses', label: 'Адреса',    icon: MapPin },
  { to: '/account/orders',    label: 'Заказы',    icon: ShoppingBag },
  { to: '/account/bonuses',   label: 'Бонусы',    icon: Star },
]

function isActive(to: string): boolean {
  return route.path.startsWith(to)
}

async function logout(): Promise<void> {
  await auth.logout()
  router.push('/')
}
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
            <ChevronRight v-if="isActive(item.to)" :size="13" class="text-accent/50" />
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

  <!-- Mobile tab bar -->
  <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-line flex">
    <RouterLink
      v-for="item in NAV"
      :key="item.to"
      :to="item.to"
      class="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors"
      :class="isActive(item.to) ? 'text-accent' : 'text-faint'"
    >
      <component :is="item.icon" :size="20" />
      {{ item.label }}
    </RouterLink>
  </nav>
</template>
