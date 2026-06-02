import { storeToRefs } from 'pinia'
import { useAuth } from '@/features/auth'
import { useCartStore } from '@/entities/cart'
import { useFavoriteStore } from '@/features/favorite-toggle'

export function usePublicHeader() {
  const auth = useAuth()
  const cartStore = useCartStore()
  const { count: cartCount, formattedTotal: cartTotal } = storeToRefs(cartStore)
  const { count: favoritesCount } = storeToRefs(useFavoriteStore())

  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    initials: auth.initials,
    cartCount,
    cartTotal,
    favoritesCount,
    openCart: cartStore.open,
    login: auth.login,
    logout: auth.logout,
  }
}
