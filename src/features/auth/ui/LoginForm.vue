<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Loader2, Eye, EyeOff } from 'lucide-vue-next'
import { ref } from 'vue'
import { useLoginForm } from '../model/useLoginForm'

const emit = defineEmits<{ success: [] }>()

const { form, errors, serverError, loading, submit } = useLoginForm()
const showPassword = ref(false)

const inputClass = (field: string, extra = '') =>
  `w-full px-3.5 py-2.5 rounded-xl border text-ink text-sm placeholder:text-faint
   focus-visible:outline-none focus-visible:ring-2 transition-colors ${extra}
   ${(errors.value as Record<string, string>)[field]
     ? 'border-red-400 bg-surface focus-visible:border-red-400 focus-visible:ring-red-200'
     : 'border-line bg-surface focus-visible:border-accent focus-visible:ring-accent/20'}`

async function onSubmit(): Promise<void> {
  const ok = await submit()
  if (ok) emit('success')
}
</script>

<template>
  <form class="space-y-4" novalidate @submit.prevent="onSubmit">
    <!-- Server error -->
    <div
      v-if="serverError"
      class="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600"
    >
      {{ serverError }}
    </div>

    <!-- Identifier -->
    <div class="space-y-1.5">
      <label class="text-sm font-medium text-ink" for="login-id">Email или телефон</label>
      <input
        id="login-id"
        v-model="form.identifier"
        type="text"
        placeholder="email@example.com или +7XXXXXXXXXX"
        autocomplete="username"
        :class="inputClass('identifier')"
      />
      <p v-if="errors.identifier" class="text-xs text-red-500 px-1">{{ errors.identifier }}</p>
    </div>

    <!-- Password -->
    <div class="space-y-1.5">
      <div class="flex items-center justify-between">
        <label class="text-sm font-medium text-ink" for="login-pw">Пароль</label>
        <RouterLink
          to="/forgot-password"
          class="text-xs text-accent hover:text-accent-hover transition-colors"
        >Забыли пароль?</RouterLink>
      </div>
      <div class="relative">
        <input
          id="login-pw"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Введите пароль"
          autocomplete="current-password"
          :class="inputClass('password', 'pr-10')"
        />
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-muted transition-colors"
          :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
          @click="showPassword = !showPassword"
        >
          <component :is="showPassword ? EyeOff : Eye" :size="16" />
        </button>
      </div>
      <p v-if="errors.password" class="text-xs text-red-500 px-1">{{ errors.password }}</p>
    </div>

    <!-- Submit -->
    <button
      type="submit"
      class="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-sm
             transition-colors disabled:opacity-60 disabled:cursor-not-allowed
             flex items-center justify-center gap-2 mt-2
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      :disabled="loading"
    >
      <Loader2 v-if="loading" :size="16" class="animate-spin" />
      {{ loading ? 'Входим…' : 'Войти' }}
    </button>

    <!-- Footer link -->
    <p class="text-center text-sm text-muted pt-1">
      Нет аккаунта?
      <RouterLink to="/register" class="text-accent font-medium hover:text-accent-hover transition-colors">
        Зарегистрироваться
      </RouterLink>
    </p>
  </form>
</template>
