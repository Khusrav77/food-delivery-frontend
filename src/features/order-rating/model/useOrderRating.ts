import { reactive, ref, computed } from 'vue'
import { useOrderStore } from '@/entities/order'
import { useToastStore } from '@/shared/lib/toast'
import { defaultDraft, isValid, toRating, type RatingDraft } from './ratingDraft'

export function useOrderRating() {
  const store = useOrderStore()
  const toast = useToastStore()

  const draft = reactive<RatingDraft>(defaultDraft())
  const submitting = ref(false)
  const canSubmit = computed(() => isValid(draft) && !submitting.value)

  function reset(): void {
    Object.assign(draft, defaultDraft())
  }

  async function submit(orderId: string): Promise<boolean> {
    if (!isValid(draft)) return false
    submitting.value = true
    try {
      await store.rate(orderId, toRating(draft))
      toast.success('Спасибо за оценку!')
      return true
    } catch {
      toast.error('Не удалось отправить оценку')
      return false
    } finally {
      submitting.value = false
    }
  }

  return { draft, submitting, canSubmit, reset, submit }
}
