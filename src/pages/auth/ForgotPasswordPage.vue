<script setup lang="ts">
import { useRouter } from 'vue-router'
import { AuthCard, ForgotForm } from '@/features/auth'

const router = useRouter()

function onSuccess(identifier: string): void {
  router.push({ path: '/reset-password', query: { identifier } })
}
</script>

<template>
  <AuthCard
    title="Восстановление пароля"
    subtitle="Введите email или телефон — отправим код подтверждения"
  >
    <ForgotForm @success="onSuccess" />
  </AuthCard>
</template>
