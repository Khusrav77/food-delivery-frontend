import { reactive, ref } from 'vue'
import { useAuth } from './useAuth'
import { validateLogin, type FormErrors } from './authRules'

export function useLoginForm() {
  const auth = useAuth()
  const form = reactive({ identifier: '', password: '' })
  const errors = ref<FormErrors>({})
  const serverError = ref<string | null>(null)
  const loading = ref(false)

  async function submit(): Promise<boolean> {
    errors.value = validateLogin(form.identifier, form.password)
    if (Object.keys(errors.value).length) return false
    loading.value = true
    serverError.value = null
    try {
      await auth.login({ identifier: form.identifier, password: form.password })
      return true
    } catch (e) {
      serverError.value = (e as { message?: string }).message ?? 'Ошибка входа'
      return false
    } finally {
      loading.value = false
    }
  }

  return { form, errors, serverError, loading, submit }
}
