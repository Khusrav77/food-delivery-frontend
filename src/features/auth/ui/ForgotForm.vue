<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'
import { useForgotForm } from '../model/useForgotForm'

const emit = defineEmits<{ success: [identifier: string] }>()

const { form, errors, serverError, loading, submit } = useForgotForm()

const base = 'w-full px-3.5 py-2.5 rounded-xl border text-ink text-sm placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 transition-colors'

async function onSubmit(): Promise<void> {
  const ok = await submit()
  if (ok) emit('success', form.identifier)
}
</script>

<template>
  <form class="space-y-4" novalidate @submit.prevent="onSubmit">
    <div
      v-if="serverError"
      class="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600"
    >
      {{ serverError }}
    </div>

    <div class="space-y-1.5">
      <label class="text-sm font-medium text-ink" for="forgot-id">Email или телефон</label>
      <input
        id="forgot-id"
        v-model="form.identifier"
        type="text"
        placeholder="email@example.com или +7XXXXXXXXXX"
        :class="`${base} ${errors.identifier ? 'border-red-400 bg-white focus-visible:border-red-400 focus-visible:ring-red-200' : 'border-line bg-surface focus-visible:border-accent focus-visible:ring-accent/20'}`"
      />
      <p v-if="errors.identifier" class="text-xs text-red-500 px-1">{{ errors.identifier }}</p>
    </div>

    <button
      type="submit"
      class="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-sm
             transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      :disabled="loading"
    >
      <Loader2 v-if="loading" :size="16" class="animate-spin" />
      {{ loading ? 'Отправляем…' : 'Отправить код' }}
    </button>

    <p class="text-center text-sm text-muted">
      <RouterLink to="/login" class="text-accent font-medium hover:text-accent-hover transition-colors">
        Вернуться ко входу
      </RouterLink>
    </p>
  </form>
</template>
