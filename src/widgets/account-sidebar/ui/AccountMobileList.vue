<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
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

async function logout(): Promise<void> {
  await auth.logout()
  router.push('/')
}

onMounted(notificationStore.fetchAll)
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- User card -->
    <div class="bg-surface rounded-2xl border border-line p-4 flex items-center gap-3">
      <div class="w-12 h-12 rounded-full bg-accent-soft border border-accent/20 flex items-center justify-center
                  text-accent text-base font-bold shrink-0">
        {{ initials }}
      </div>
      <div class="min-w-0">
        <p class="text-base font-semibold text-ink truncate">{{ user?.name }}</p>
        <p class="text-sm text-faint truncate">{{ user?.email ?? user?.phone }}</p>
      </div>
    </div>

    <!-- Section list -->
    <nav class="bg-surface rounded-2xl border border-line overflow-hidden divide-y divide-line">
      <RouterLink
        v-for="item in ACCOUNT_NAV"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-4 py-3.5 active:bg-surface-soft transition-colors"
      >
        <span class="w-9 h-9 rounded-xl bg-surface-soft flex items-center justify-center shrink-0">
          <component :is="item.icon" :size="18" class="text-muted" />
        </span>
        <span class="flex-1 text-[15px] font-medium text-ink">{{ item.label }}</span>
        <span
          v-if="item.to === '/account/notifications' && unreadCount > 0"
          class="min-w-[20px] h-5 px-1.5 rounded-full bg-accent text-white text-[11px] font-bold
                 flex items-center justify-center shrink-0"
        >
          {{ unreadCount }}
        </span>
        <ChevronRight :size="18" class="text-faint shrink-0" />
      </RouterLink>
    </nav>

    <!-- Logout -->
    <button
      class="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-surface border border-line
             text-sm font-semibold text-red-500 active:bg-red-50 dark:active:bg-red-950/30 transition-colors
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/40"
      @click="logout"
    >
      <LogOut :size="16" class="shrink-0" />
      Выйти
    </button>
  </div>
</template>
