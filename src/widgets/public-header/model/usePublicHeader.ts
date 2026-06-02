import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/features/auth'
import { useCartStore } from '@/entities/cart'
import { useFavoriteStore } from '@/features/favorite-toggle'

export function usePublicHeader() {
  const auth = useAuth()
  const router = useRouter()
  const route = useRoute()
  const cartStore = useCartStore()
  const { count: cartCount, formattedTotal: cartTotal } = storeToRefs(cartStore)
  const { count: favoritesCount } = storeToRefs(useFavoriteStore())

  function goToLogin(): void {
    const current = route.fullPath
    const skip = ['/', '/login', '/register', '/forgot-password', '/reset-password']
    const redirect = skip.includes(current) ? undefined : current
    router.push(redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login')
  }

  async function logout(): Promise<void> {
    await auth.logout()
    router.push('/')
  }

  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    initials: auth.initials,
    cartCount,
    cartTotal,
    favoritesCount,
    openCart: cartStore.open,
    goToLogin,
    logout,
  }
}
