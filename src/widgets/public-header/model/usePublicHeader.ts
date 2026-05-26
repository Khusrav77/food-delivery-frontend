import { storeToRefs } from 'pinia'
import { useAuth } from '@/features/auth'
import { useCartStore } from '@/entities/cart'
import { useFavoriteStore } from '@/features/favorite-toggle'

export function usePublicHeader() {
  const auth = useAuth()
  const { count: cartCount, formattedTotal: cartTotal } = storeToRefs(useCartStore())
  const { count: favoritesCount } = storeToRefs(useFavoriteStore())

  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    initials: auth.initials,
    cartCount,
    cartTotal,
    favoritesCount,
    login: auth.login,
    logout: auth.logout,
  }
}
