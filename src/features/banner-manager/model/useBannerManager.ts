import { ref, reactive, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import {
  useBannerStore,
  defaultDraft,
  validateDraft,
  bannerToDraft,
  type IBanner,
  type IBannerDraft,
} from '@/entities/banner'
import { useToastStore } from '@/shared/lib/toast'

export function useBannerManager() {
  const store = useBannerStore()
  const toast = useToastStore()
  const { list } = storeToRefs(store)

  // Local drag-mutable copy; resyncs whenever the store list changes (add/edit/remove/reorder).
  const ordered = ref<IBanner[]>([...list.value])
  watch(list, (next) => { ordered.value = [...next] }, { deep: true })

  // Modal / form state
  const showForm = ref(false)
  const editingId = ref<string | null>(null)
  const draft = reactive<IBannerDraft>(defaultDraft())

  const errors = computed(() => validateDraft(draft))
  const canSave = computed(() => Object.keys(errors.value).length === 0)
  const isEditing = computed(() => editingId.value !== null)

  function openCreate(): void {
    editingId.value = null
    Object.assign(draft, defaultDraft())
    showForm.value = true
  }

  function openEdit(banner: IBanner): void {
    editingId.value = banner.id
    Object.assign(draft, bannerToDraft(banner))
    showForm.value = true
  }

  function closeForm(): void {
    showForm.value = false
  }

  function save(): void {
    if (!canSave.value) return
    if (editingId.value) {
      store.update(editingId.value, { ...draft })
      toast.success('Баннер обновлён')
    } else {
      store.create({ ...draft })
      toast.success('Баннер добавлен')
    }
    showForm.value = false
  }

  function remove(banner: IBanner): void {
    store.remove(banner.id)
    toast.info('Баннер удалён')
  }

  function toggle(banner: IBanner): void {
    store.toggle(banner.id)
    toast.info(banner.isActive ? 'Баннер скрыт' : 'Баннер показан')
  }

  function persistOrder(): void {
    store.reorder(ordered.value.map((b) => b.id))
  }

  return {
    ordered,
    showForm,
    draft,
    errors,
    canSave,
    isEditing,
    openCreate,
    openEdit,
    closeForm,
    save,
    remove,
    toggle,
    persistOrder,
  }
}
