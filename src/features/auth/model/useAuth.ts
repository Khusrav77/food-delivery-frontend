import { storeToRefs } from 'pinia'
import { useUserStore } from '@/entities/user'
import { loginUser, registerUser, logoutUser } from '@/entities/user'
import type { ILoginPayload, IRegisterPayload } from '@/entities/user'

export function useAuth() {
  const userStore = useUserStore()
  const { user, isAuthenticated, initials } = storeToRefs(userStore)

  async function login(payload: ILoginPayload): Promise<void> {
    const { token, user: u } = await loginUser(payload)
    userStore.setToken(token)
    userStore.setUser(u)
  }

  async function register(payload: IRegisterPayload): Promise<void> {
    const { token, user: u } = await registerUser(payload)
    userStore.setToken(token)
    userStore.setUser(u)
  }

  async function logout(): Promise<void> {
    try { await logoutUser() } catch { /* ignore */ }
    userStore.clearToken()
    userStore.clear()
  }

  return { isAuthenticated, user, initials, login, register, logout }
}
