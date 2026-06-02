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
        { path: 'restaurants', component: () => import('@/pages/admin/RestaurantsPage.vue') },
        { path: 'menu', component: () => import('@/pages/admin/MenuPage.vue') },
        { path: 'couriers', component: () => import('@/pages/admin/CouriersPage.vue') },
        { path: 'customers', component: () => import('@/pages/admin/CustomersPage.vue') },
        { path: 'analytics', component: () => import('@/pages/admin/AnalyticsPage.vue') },
        { path: 'promotions', component: () => import('@/pages/admin/PromotionsPage.vue') },
        { path: 'settings', component: () => import('@/pages/admin/SettingsPage.vue') },
      ],
    },
  ],
})

// Если пользователь уже авторизован — не пускать на /login, /register и т.д.
// useUserStore() вызывается внутри guard (не на уровне модуля) — Pinia уже активна.
router.beforeEach((to) => {
  if (to.meta.guestOnly && useUserStore().isAuthenticated) return '/'
})
