import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useCardStore } from '@/entities/card'
import type { CardDraft, CardDraftErrors } from './types'
import { defaultDraft, validateDraft, toPayload } from './cardDraft'

export function useCardManager() {
  const store = useCardStore()
  const { list, loading } = storeToRefs(store)

  const isFormOpen = ref(false)
  const draft = reactive<CardDraft>(defaultDraft())
  const errors = ref<CardDraftErrors>({})
  const saving = ref(false)
  const serverError = ref<string | null>(null)

  function openCreate(): void {
    Object.assign(draft, defaultDraft())
    errors.value = {}
    serverError.value = null
    isFormOpen.value = true
  }

  function closeForm(): void {
    isFormOpen.value = false
  }

  async function save(): Promise<void> {
    errors.value = validateDraft(draft)
    if (Object.keys(errors.value).length) return
    saving.value = true
    serverError.value = null
    try {
      await store.create(toPayload(draft))
      isFormOpen.value = false
    } catch (e) {
      serverError.value = (e as { message?: string }).message ?? 'Не удалось сохранить карту'
    } finally {
      saving.value = false
    }
  }

  async function remove(id: string): Promise<void> {
    await store.remove(id)
  }

  async function setPrimary(id: string): Promise<void> {
    await store.setPrimary(id)
  }

  return {
    list,
    loading,
    isFormOpen,
    draft,
    errors,
    saving,
    serverError,
    openCreate,
    closeForm,
    save,
    remove,
    setPrimary,
    fetchAll: store.fetchAll,
  }
}
