import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useAddressStore } from '@/entities/address'
import type { IAddress } from '@/entities/address'
import { defaultDraft, draftFromAddress, validateDraft, toPayload, type AddressDraft, type AddressDraftErrors } from './addressDraft'

export function useAddressManager() {
  const store = useAddressStore()
  const { list, loading } = storeToRefs(store)

  const isFormOpen = ref(false)
  const editingId = ref<string | null>(null)
  const draft = reactive<AddressDraft>(defaultDraft())
  const errors = ref<AddressDraftErrors>({})
  const saving = ref(false)
  const serverError = ref<string | null>(null)

  function openCreate(): void {
    editingId.value = null
    Object.assign(draft, defaultDraft())
    errors.value = {}
    serverError.value = null
    isFormOpen.value = true
  }

  function openEdit(addr: IAddress): void {
    editingId.value = addr.id
    Object.assign(draft, draftFromAddress(addr))
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
      const payload = toPayload(draft)
      if (editingId.value) {
        await store.update(editingId.value, payload)
      } else {
        await store.create(payload)
      }
      isFormOpen.value = false
    } catch (e) {
      serverError.value = (e as { message?: string }).message ?? 'Не удалось сохранить адрес'
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
    editingId,
    draft,
    errors,
    saving,
    serverError,
    openCreate,
    openEdit,
    closeForm,
    save,
    remove,
    setPrimary,
    fetchAll: store.fetchAll,
  }
}
