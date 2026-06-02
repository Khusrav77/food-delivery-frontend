import { reactive, ref } from 'vue'
import { requestPasswordReset } from '@/entities/user'
import { validateResetRequest, type FormErrors } from './authRules'

export function useForgotForm() {
  const form = reactive({ identifier: '' })
  const errors = ref<FormErrors>({})
  const serverError = ref<string | null>(null)
  const loading = ref(false)

  async function submit(): Promise<boolean> {
    errors.value = validateResetRequest(form.identifier)
    if (Object.keys(errors.value).length) return false
    loading.value = true
    serverError.value = null
    try {
      await requestPasswordReset({ identifier: form.identifier })
      return true
    } catch (e) {
      serverError.value = (e as { message?: string }).message ?? 'Не удалось отправить код'
      return false
    } finally {
      loading.value = false
    }
  }

  return { form, errors, serverError, loading, submit }
}
