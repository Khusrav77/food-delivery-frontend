import { storeToRefs } from 'pinia'
import { useUserStore } from '@/entities/user'

const MOCK_USER = {
  id: 'mock-1',
  name: 'Алексей Смирнов',
  bonusBalance: 5,
} as const

export function useAuth() {
  const userStore = useUserStore()
  const { user, isAuthenticated, initials } = storeToRefs(userStore)

  function login(): void {
    userStore.setUser({ ...MOCK_USER })
  }

  function logout(): void {
    userStore.clear()
  }

  return { isAuthenticated, user, initials, login, logout }
}
