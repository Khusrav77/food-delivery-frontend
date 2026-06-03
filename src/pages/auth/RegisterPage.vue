<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useToastStore } from '@/shared/lib/toast'
import { AuthCard, RegisterForm } from '@/features/auth'

const router = useRouter()
const route  = useRoute()
const toast  = useToastStore()

function onSuccess(): void {
  toast.success('Аккаунт создан! Добро пожаловать.')
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  router.push(redirect)
}
</script>

<template>
  <AuthCard title="Регистрация" subtitle="Создайте аккаунт и получайте бонусы за каждый заказ">
    <RegisterForm @success="onSuccess" />
  </AuthCard>
</template>
