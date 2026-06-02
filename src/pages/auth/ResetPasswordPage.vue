<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToastStore } from '@/shared/lib/toast'
import { AuthCard, ResetConfirmForm } from '@/features/auth'

const router = useRouter()
const route  = useRoute()
const toast  = useToastStore()

const identifier = computed(() =>
  typeof route.query.identifier === 'string' ? route.query.identifier : '',
)

// Без identifier на этой странице делать нечего
if (!identifier.value) router.replace('/forgot-password')

function onSuccess(): void {
  toast.success('Пароль успешно изменён. Войдите с новым паролем.')
  router.push('/login')
}
</script>

<template>
  <AuthCard title="Новый пароль" subtitle="Введите код из письма и задайте новый пароль">
    <ResetConfirmForm :identifier="identifier" @success="onSuccess" />
  </AuthCard>
</template>
