import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/features/auth'
import { useCartStore } from '@/entities/cart'
import { useFavoriteStore } from '@/entities/favorite'
import { useDeliveryLocationStore } from '@/entities/delivery-location'

export function usePublicHeader() {
  const auth = useAuth()
  const router = useRouter()
  const route = useRoute()
  const cartStore = useCartStore()
  const { count: cartCount, formattedTotal: cartTotal } = storeToRefs(cartStore)
  const { count: favoritesCount } = storeToRefs(useFavoriteStore())

  const { shortLabel: locationLabel, hasLocation } = storeToRefs(useDeliveryLocationStore())
  const pickerOpen = ref(false)

  function goToLogin(): void {
    const current = route.fullPath
    const skip = ['/', '/login', '/register', '/forgot-password', '/reset-password']
    const redirect = skip.includes(current) ? undefined : current
    router.push(redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login')
  }

  function goToAccount(): void {
    router.push('/account')
  }

  function goToBonuses(): void {
    router.push('/account/bonuses')
  }

  function goToFavorites(): void {
    router.push('/favorites')
  }

  function goToSearch(): void {
    router.push('/search')
  }

  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    initials: auth.initials,
    cartCount,
    cartTotal,
    favoritesCount,
    locationLabel,
    hasLocation,
    pickerOpen,
    openPicker: () => { pickerOpen.value = true },
    closePicker: () => { pickerOpen.value = false },
    openCart: cartStore.open,
    goToLogin,
    goToAccount,
    goToBonuses,
    goToFavorites,
    goToSearch,
  }
}
