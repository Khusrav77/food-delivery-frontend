<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Loader2, Eye, EyeOff } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRegisterForm } from '../model/useRegisterForm'

const emit = defineEmits<{ success: [] }>()

const { form, errors, serverError, loading, submit } = useRegisterForm()
const showPassword = ref(false)

const base = 'w-full px-3.5 py-2.5 rounded-xl border text-ink text-sm placeholder:text-faint focus-visible:outline-none focus:ring-2 transition-colors'
const ok   = 'border-line bg-surface focus:border-accent focus:ring-accent/20'
const err  = 'border-red-400 bg-white focus:border-red-400 focus:ring-red-200'
const cls  = (f: string, extra = '') => `${base} ${(errors.value as Record<string,string>)[f] ? err : ok} ${extra}`

async function onSubmit(): Promise<void> {
  const ok = await submit()
  if (ok) emit('success')
}
</script>

<template>
  <form class="space-y-3.5" novalidate @submit.prevent="onSubmit">
    <div
      v-if="serverError"
      class="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600"
    >
      {{ serverError }}
    </div>

    <!-- Name row -->
    <div class="grid grid-cols-2 gap-3">
      <div class="space-y-1.5">
        <label class="text-sm font-medium text-ink" for="r-fname">Имя</label>
        <input id="r-fname" v-model="form.firstName" type="text" placeholder="Алексей" autocomplete="given-name" :class="cls('firstName')" />
        <p v-if="errors.firstName" class="text-xs text-red-500 px-1">{{ errors.firstName }}</p>
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium text-ink" for="r-lname">Фамилия</label>
        <input id="r-lname" v-model="form.lastName" type="text" placeholder="Смирнов" autocomplete="family-name" :class="cls('lastName')" />
        <p v-if="errors.lastName" class="text-xs text-red-500 px-1">{{ errors.lastName }}</p>
      </div>
    </div>

    <!-- Email -->
    <div class="space-y-1.5">
      <label class="text-sm font-medium text-ink" for="r-email">Email</label>
      <input id="r-email" v-model="form.email" type="email" placeholder="email@example.com" autocomplete="email" :class="cls('email')" />
      <p v-if="errors.email" class="text-xs text-red-500 px-1">{{ errors.email }}</p>
    </div>

    <!-- Phone -->
    <div class="space-y-1.5">
      <label class="text-sm font-medium text-ink" for="r-phone">Телефон</label>
      <input id="r-phone" v-model="form.phone" type="tel" placeholder="+7 999 000 00 00" autocomplete="tel" :class="cls('phone')" />
      <p v-if="errors.phone" class="text-xs text-red-500 px-1">{{ errors.phone }}</p>
    </div>

    <!-- Password -->
    <div class="space-y-1.5">
      <label class="text-sm font-medium text-ink" for="r-pw">Пароль</label>
      <div class="relative">
        <input
          id="r-pw"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Минимум 8 символов"
          autocomplete="new-password"
          :class="cls('password', 'pr-10')"
        />
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-muted transition-colors"
          @click="showPassword = !showPassword"
        >
          <component :is="showPassword ? EyeOff : Eye" :size="16" />
        </button>
      </div>
      <p v-if="errors.password" class="text-xs text-red-500 px-1">{{ errors.password }}</p>
    </div>

    <!-- Confirm -->
    <div class="space-y-1.5">
      <label class="text-sm font-medium text-ink" for="r-confirm">Подтверждение пароля</label>
      <input id="r-confirm" v-model="form.confirm" :type="showPassword ? 'text' : 'password'" placeholder="Повторите пароль" autocomplete="new-password" :class="cls('confirm')" />
      <p v-if="errors.confirm" class="text-xs text-red-500 px-1">{{ errors.confirm }}</p>
    </div>

    <button
      type="submit"
      class="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-sm
             transition-colors disabled:opacity-60 disabled:cursor-not-allowed
             flex items-center justify-center gap-2 mt-1
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      :disabled="loading"
    >
      <Loader2 v-if="loading" :size="16" class="animate-spin" />
      {{ loading ? 'Регистрируем…' : 'Создать аккаунт' }}
    </button>

    <p class="text-center text-sm text-muted pt-1">
      Уже есть аккаунт?
      <RouterLink to="/login" class="text-accent font-medium hover:text-accent-hover transition-colors">Войти</RouterLink>
    </p>
  </form>
</template>
