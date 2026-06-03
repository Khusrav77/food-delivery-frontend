<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Bell, ShoppingBag, Star, Ticket, CheckCheck } from 'lucide-vue-next'
import { useNotificationStore, type NotificationType } from '@/entities/notification'
import { formatDateTime } from '@/shared/lib/date'

const store = useNotificationStore()
const { list, loading, unreadCount } = storeToRefs(store)

const ICON: Record<NotificationType, typeof ShoppingBag> = {
  order: ShoppingBag,
  bonus: Star,
  promo: Ticket,
}

const ICON_CLASS: Record<NotificationType, string> = {
  order: 'bg-blue-50 text-blue-500',
  bonus: 'bg-emerald-50 text-emerald-500',
  promo: 'bg-orange-50 text-orange-500',
}

onMounted(store.fetchAll)
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between gap-3">
      <h2 class="text-lg font-semibold text-ink">Уведомления</h2>
      <button
        v-if="unreadCount > 0"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line text-sm font-medium text-muted
               hover:text-ink hover:border-ink/20 transition-colors
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        @click="store.markAllRead"
      >
        <CheckCheck :size="14" />
        Отметить все прочитанными
      </button>
    </div>

    <!-- Loading skeletons -->
    <div v-if="loading" class="space-y-3">
      <div
        v-for="i in 3"
        :key="i"
        class="flex items-center gap-3 bg-surface rounded-2xl border border-line p-4"
      >
        <div class="w-10 h-10 rounded-xl bg-canvas animate-pulse shrink-0" />
        <div class="flex-1 space-y-2">
          <div class="h-3.5 bg-canvas rounded animate-pulse w-40" />
          <div class="h-3 bg-canvas rounded animate-pulse w-full max-w-md" />
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div
      v-else-if="list.length === 0"
      class="flex flex-col items-center gap-3 py-16 text-center"
    >
      <div class="w-14 h-14 rounded-2xl bg-canvas border border-line flex items-center justify-center">
        <Bell :size="22" class="text-faint" />
      </div>
      <p class="text-muted text-sm">Уведомлений пока нет</p>
    </div>

    <!-- List -->
    <ul v-else class="space-y-3">
      <li
        v-for="n in list"
        :key="n.id"
        class="flex items-start gap-3 rounded-2xl border p-4 transition-colors"
        :class="n.isRead
          ? 'bg-canvas border-line'
          : 'bg-surface border-accent/20'"
      >
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          :class="ICON_CLASS[n.type]"
        >
          <component :is="ICON[n.type]" :size="18" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <p
              class="text-sm font-semibold truncate"
              :class="n.isRead ? 'text-muted' : 'text-ink'"
            >
              {{ n.title }}
            </p>
            <span v-if="!n.isRead" class="w-2 h-2 rounded-full bg-accent shrink-0" />
          </div>
          <p class="text-sm mt-1" :class="n.isRead ? 'text-faint' : 'text-muted'">
            {{ n.body }}
          </p>
          <p class="text-xs text-faint mt-1.5">{{ formatDateTime(n.createdAt) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
