import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { INotification } from './types'
import { fetchNotifications, markAllRead as apiMarkAllRead } from '../api/notificationApi'

export const useNotificationStore = defineStore('notification', () => {
  const list = ref<INotification[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const unreadCount = computed(() => list.value.filter((n) => !n.isRead).length)

  async function fetchAll(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      list.value = await fetchNotifications()
    } catch (e) {
      error.value = (e as { message?: string }).message ?? 'Ошибка загрузки уведомлений'
    } finally {
      loading.value = false
    }
  }

  async function markAllRead(): Promise<void> {
    await apiMarkAllRead()
    list.value = list.value.map((n) => ({ ...n, isRead: true }))
  }

  return { list, loading, error, unreadCount, fetchAll, markAllRead }
})
