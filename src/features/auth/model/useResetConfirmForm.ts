import { reactive, ref } from 'vue'
import { confirmPasswordReset } from '@/entities/user'
import { validateResetConfirm, type FormErrors } from './authRules'

export function useResetConfirmForm() {
  const form = reactive({ identifier: '', code: '', newPassword: '', confirm: '' })
  const errors = ref<FormErrors>({})
  const serverError = ref<string | null>(null)
  const loading = ref(false)

  async function submit(): Promise<boolean> {
    errors.value = validateResetConfirm(form.code, form.newPassword, form.confirm)
    if (Object.keys(errors.value).length) return false
    loading.value = true
    serverError.value = null
    try {
      await confirmPasswordReset({
        identifier: form.identifier,
        code: form.code,
        newPassword: form.newPassword,
      })
      return true
    } catch (e) {
      serverError.value = (e as { message?: string }).message ?? 'Не удалось сменить пароль'
      return false
    } finally {
      loading.value = false
    }
  }

  return { form, errors, serverError, loading, submit }
}
