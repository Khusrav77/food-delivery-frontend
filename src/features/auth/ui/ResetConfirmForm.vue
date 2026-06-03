<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Loader2, Eye, EyeOff } from 'lucide-vue-next'
import { ref } from 'vue'
import { useResetConfirmForm } from '../model/useResetConfirmForm'

const props = defineProps<{ identifier: string }>()
const emit  = defineEmits<{ success: [] }>()

const { form, errors, serverError, loading, submit } = useResetConfirmForm()
const showPassword = ref(false)

const base = 'w-full px-3.5 py-2.5 rounded-xl border text-ink text-sm placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 transition-colors'
const cls  = (f: string, extra = '') =>
  `${base} ${(errors.value as Record<string,string>)[f] ? 'border-red-400 bg-white focus-visible:border-red-400 focus-visible:ring-red-200' : 'border-line bg-surface focus-visible:border-accent focus-visible:ring-accent/20'} ${extra}`

async function onSubmit(): Promise<void> {
  form.identifier = props.identifier
  const ok = await submit()
  if (ok) emit('success')
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

    <!-- Hint for mock -->
    <div class="px-4 py-3 rounded-xl bg-accent-soft border border-accent/20 text-sm text-accent">
      Код отправлен на <strong>{{ identifier }}</strong>. Для теста используйте код <strong>1234</strong>.
    </div>

    <div class="space-y-1.5">
      <label class="text-sm font-medium text-ink" for="rc-code">Код подтверждения</label>
      <input id="rc-code" v-model="form.code" type="text" placeholder="1234" inputmode="numeric" maxlength="6" :class="cls('code')" />
      <p v-if="errors.code" class="text-xs text-red-500 px-1">{{ errors.code }}</p>
    </div>

    <div class="space-y-1.5">
      <label class="text-sm font-medium text-ink" for="rc-pw">Новый пароль</label>
      <div class="relative">
        <input id="rc-pw" v-model="form.newPassword" :type="showPassword ? 'text' : 'password'" placeholder="Минимум 8 символов" autocomplete="new-password" :class="cls('newPassword', 'pr-10')" />
        <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-muted transition-colors" @click="showPassword = !showPassword">
          <component :is="showPassword ? EyeOff : Eye" :size="16" />
        </button>
      </div>
      <p v-if="errors.newPassword" class="text-xs text-red-500 px-1">{{ errors.newPassword }}</p>
    </div>

    <div class="space-y-1.5">
      <label class="text-sm font-medium text-ink" for="rc-confirm">Подтверждение</label>
      <input id="rc-confirm" v-model="form.confirm" :type="showPassword ? 'text' : 'password'" placeholder="Повторите пароль" autocomplete="new-password" :class="cls('confirm')" />
      <p v-if="errors.confirm" class="text-xs text-red-500 px-1">{{ errors.confirm }}</p>
    </div>

    <button
      type="submit"
      class="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-sm
             transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      :disabled="loading"
    >
      <Loader2 v-if="loading" :size="16" class="animate-spin" />
      {{ loading ? 'Сохраняем…' : 'Сохранить пароль' }}
    </button>

    <p class="text-center text-sm text-muted">
      <RouterLink to="/login" class="text-accent font-medium hover:text-accent-hover transition-colors">
        Вернуться ко входу
      </RouterLink>
    </p>
  </form>
</template>
