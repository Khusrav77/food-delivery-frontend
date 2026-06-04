import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/entities/cart'
import { useFavoriteStore } from '@/entities/favorite'
import { TABS } from './tabs'

export function useMobileTabBar() {
  const route = useRoute()
  const { count: cartCount } = storeToRefs(useCartStore())
  const { count: favoritesCount } = storeToRefs(useFavoriteStore())

  const effectiveTabs = computed(() =>
    TABS.map((tab) => {
      const active = tab.exact
        ? route.path === tab.to
        : route.path.startsWith(tab.to)
      const badgeCount =
        tab.badge === 'cart' ? cartCount.value :
        tab.badge === 'favorites' ? favoritesCount.value : 0
      return { ...tab, active, badgeCount }
    }),
  )

  return { effectiveTabs }
}
