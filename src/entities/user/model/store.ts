


import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { AUTH_TOKEN_KEY } from '@/shared/api'
import type { IUser, IUpdateProfilePayload } from './types'
import { getMe, updateProfile } from '../api/authApi'

export const useUserStore = defineStore('user', () => {
  const user = ref<IUser | null>(null)

  const isAuthenticated = computed(() => user.value !== null)

  const initials = computed(() => {
    if (!user.value) return ''
    return user.value.name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
  })

  function setUser(u: IUser): void {
    user.value = u
  }

  function clear(): void {
    user.value = null
  }

  function setToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  }

  function clearToken(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }

  // Вызывается при старте приложения — восстанавливает сессию из токена.
  async function init(): Promise<void> {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token) return
    try {
      user.value = await getMe()
    } catch {
      localStorage.removeItem(AUTH_TOKEN_KEY)
    }
  }

  const updating = ref(false)
  const updateError = ref<string | null>(null)

  async function update(payload: IUpdateProfilePayload): Promise<void> {
    updating.value = true
    updateError.value = null
    try {
      user.value = await updateProfile(payload)
    } catch (e) {
      updateError.value = (e as { message?: string }).message ?? 'Не удалось сохранить'
      throw e
    } finally {
      updating.value = false
    }
  }

  return { user, isAuthenticated, initials, setUser, clear, setToken, clearToken, init, update, updating, updateError }
})
