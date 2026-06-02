import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/app/layouts/AdminLayout.vue'
import PublicLayout from '@/app/layouts/PublicLayout.vue'
import { useUserStore } from '@/entities/user'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [
        { path: '', component: () => import('@/pages/home/HomePage.vue') },
        { path: 'checkout', component: () => import('@/pages/checkout/CheckoutPage.vue') },
        { path: 'checkout/success', component: () => import('@/pages/checkout/CheckoutSuccessPage.vue') },
        {
          path: 'orders/:id/track',
          component: () => import('@/pages/orders/TrackOrderPage.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'account',
          component: () => import('@/pages/account/AccountLayout.vue'),
          meta: { requiresAuth: true },
          children: [
            { path: '', redirect: '/account/profile' },
            { path: 'profile', component: () => import('@/pages/account/ProfilePage.vue') },
            { path: 'addresses', component: () => import('@/pages/account/AddressesPage.vue') },
            { path: 'orders', component: () => import('@/pages/account/OrdersPage.vue') },
            { path: 'bonuses', component: () => import('@/pages/account/BonusesPage.vue') },
          ],
        },
      ],
    },
    // Auth pages — вне PublicLayout (нет хедера/корзины)
    {
      path: '/login',
      component: () => import('@/pages/auth/LoginPage.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      component: () => import('@/pages/auth/RegisterPage.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/forgot-password',
      component: () => import('@/pages/auth/ForgotPasswordPage.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/reset-password',
      component: () => import('@/pages/auth/ResetPasswordPage.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        { path: 'dashboard', component: () => import('@/pages/admin/DashboardPage.vue') },
        { path: 'orders', component: () => import('@/pages/admin/OrdersPage.vue') },
        { path: 'orders/:id', component: () => import('@/pages/admin/OrderDetailPage.vue') },
        { path: 'restaurants', component: () => import('@/pages/admin/RestaurantsPage.vue') },
        { path: 'menu', component: () => import('@/pages/admin/MenuPage.vue') },
        { path: 'couriers', component: () => import('@/pages/admin/CouriersPage.vue') },
        { path: 'couriers/:id', component: () => import('@/pages/admin/CourierDetailPage.vue') },
        { path: 'customers', component: () => import('@/pages/admin/CustomersPage.vue') },
        { path: 'customers/:id', component: () => import('@/pages/admin/CustomerDetailPage.vue') },
        { path: 'delivery-zones', component: () => import('@/pages/admin/DeliveryZonesPage.vue') },
        { path: 'analytics', component: () => import('@/pages/admin/AnalyticsPage.vue') },
        { path: 'promotions', component: () => import('@/pages/admin/PromotionsPage.vue') },
        { path: 'settings', component: () => import('@/pages/admin/SettingsPage.vue') },
      ],
    },
  ],
})

// Guards: вызываются внутри beforeEach — Pinia гарантированно активна к этому моменту.
// При прямой навигации (full page load) guard запускается раньше App.vue onMounted,
// поэтому сами восстанавливаем сессию если store ещё пуст.
router.beforeEach(async (to) => {
  const store = useUserStore()
  if (!store.isAuthenticated) {
    await store.init()
  }
  if (to.meta.guestOnly && store.isAuthenticated) return '/'
  if (to.meta.requiresAuth && !store.isAuthenticated) {
    return `/login?redirect=${encodeURIComponent(to.fullPath)}`
  }
})
