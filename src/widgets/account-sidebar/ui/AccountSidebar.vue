<script setup lang="ts">
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { LogOut, ChevronRight } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/entities/user'
import { useNotificationStore } from '@/entities/notification'
import { useAuth } from '@/features/auth'
import { ACCOUNT_NAV } from '../model/nav'

const { user, initials } = storeToRefs(useUserStore())
const notificationStore = useNotificationStore()
const { unreadCount } = storeToRefs(notificationStore)
const auth = useAuth()
const router = useRouter()
const route = useRoute()

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
        <li v-for="item in ACCOUNT_NAV" :key="item.to">
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
                 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/40"
          @click="logout"
        >
          <LogOut :size="16" class="shrink-0" />
          Выйти
        </button>
      </div>
    </nav>
  </aside>
</template>
