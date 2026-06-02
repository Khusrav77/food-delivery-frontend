<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useToastStore } from '@/shared/lib/toast'
import { AuthCard, LoginForm } from '@/features/auth'

const router = useRouter()
const route  = useRoute()
const toast  = useToastStore()

function onSuccess(): void {
  toast.success('Добро пожаловать!')
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  router.push(redirect)
}
</script>

<template>
  <AuthCard title="Вход в аккаунт" subtitle="Войдите, чтобы оформлять заказы и отслеживать доставку">
    <LoginForm @success="onSuccess" />
  </AuthCard>
</template>
