import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/app/layouts/AdminLayout.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/admin/dashboard' },
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