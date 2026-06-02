import { reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/entities/user'
import type { IUpdateProfilePayload } from '@/entities/user'
import { validateProfile, splitName, type ProfileErrors } from './profileRules'

export function useProfileForm() {
  const store = useUserStore()
  const { user, updating } = storeToRefs(store)

  const { firstName: initFirst, lastName: initLast } = splitName(user.value?.name ?? '')

  const form = reactive<IUpdateProfilePayload>({
    firstName: initFirst,
    lastName: initLast,
    email: user.value?.email ?? '',
    phone: user.value?.phone ?? '',
  })

  const errors = ref<ProfileErrors>({})
  const serverError = ref<string | null>(null)
  const saved = ref(false)

  async function submit(): Promise<void> {
    errors.value = validateProfile(form)
    serverError.value = null
    saved.value = false
    if (Object.keys(errors.value).length) return
    try {
      await store.update({ ...form })
      saved.value = true
      setTimeout(() => { saved.value = false }, 3000)
    } catch (e) {
      serverError.value = (e as { message?: string }).message ?? 'Не удалось сохранить'
    }
  }

  return { form, errors, serverError, saved, updating, submit }
}
