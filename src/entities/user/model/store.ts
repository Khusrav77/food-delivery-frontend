import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { IUser } from './types'

export const useUserStore = defineStore('user', () => {
  const user = ref<IUser | null>(null)

  const isAuthenticated = computed(() => user.value !== null)

  const initials = computed(() => {
    if (!user.value) return ''
    return user.value.name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase()
  })

  function setUser(u: IUser): void {
    user.value = u
  }

  function clear(): void {
    user.value = null
  }

  return { user, isAuthenticated, initials, setUser, clear }
})
