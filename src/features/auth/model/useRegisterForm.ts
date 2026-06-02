import { reactive, ref } from 'vue'
import { useAuth } from './useAuth'
import { validateRegister, type FormErrors } from './authRules'

export function useRegisterForm() {
  const auth = useAuth()
  const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  })
  const errors = ref<FormErrors>({})
  const serverError = ref<string | null>(null)
  const loading = ref(false)

  async function submit(): Promise<boolean> {
    errors.value = validateRegister(form)
    if (Object.keys(errors.value).length) return false
    loading.value = true
    serverError.value = null
    try {
      await auth.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      })
      return true
    } catch (e) {
      serverError.value = (e as { message?: string }).message ?? 'Ошибка регистрации'
      return false
    } finally {
      loading.value = false
    }
  }

  return { form, errors, serverError, loading, submit }
}
