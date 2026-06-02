import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminZoneStore } from '@/entities/delivery-zone'
import { useToastStore } from '@/shared/lib/toast'
import type { IDeliveryZone, IGeoPoint, IZoneDraft } from '@/entities/delivery-zone'

export function useDeliveryZonesPage() {
  const store = useAdminZoneStore()
  const toast = useToastStore()
  const { list: zones, loadingList, listError } = storeToRefs(store)

  const selectedId     = ref<string | null>(null)
  const showModal      = ref(false)
  const editingZone    = ref<IDeliveryZone | null>(null)
  const pendingPolygon = ref<IGeoPoint[] | null>(null)
  const modalSaving    = ref(false)

  function selectZone(id: string | null): void {
    selectedId.value = id
  }

  function handleDrawFinish(points: IGeoPoint[]): void {
    pendingPolygon.value = points
    editingZone.value    = null
    showModal.value      = true
  }

  function handleEditParams(id: string): void {
    const zone = zones.value.find((z) => z.id === id)
    if (!zone) return
    editingZone.value    = { ...zone, polygon: [...zone.polygon] }
    pendingPolygon.value = null
    showModal.value      = true
  }

  function closeModal(): void {
    showModal.value      = false
    pendingPolygon.value = null
    editingZone.value    = null
  }

  async function saveZone(draft: IZoneDraft): Promise<void> {
    modalSaving.value = true
    try {
      if (editingZone.value) {
        await store.update(editingZone.value.id, draft)
        toast.success('Параметры зоны обновлены')
      } else if (pendingPolygon.value) {
        const zone = await store.create(draft, pendingPolygon.value)
        selectedId.value = zone.id
        toast.success(`Зона «${draft.name}» создана`)
      }
      closeModal()
    } catch (e) {
      toast.error((e as { message?: string }).message ?? 'Ошибка сохранения')
    } finally {
      modalSaving.value = false
    }
  }

  async function deleteZone(id: string): Promise<void> {
    const zone = zones.value.find((z) => z.id === id)
    if (!zone) return
    try {
      await store.remove(id)
      if (selectedId.value === id) selectedId.value = null
      toast.success(`Зона «${zone.name}» удалена`)
    } catch (e) {
      toast.error((e as { message?: string }).message ?? 'Ошибка удаления')
    }
  }

  async function handleGeometrySave(id: string, points: IGeoPoint[]): Promise<void> {
    try {
      await store.updatePolygon(id, points)
      toast.success('Контур зоны сохранён')
    } catch (e) {
      toast.error((e as { message?: string }).message ?? 'Ошибка сохранения контура')
    }
  }

  return reactive({
    zones,
    loadingList,
    listError,
    selectedId,
    showModal,
    editingZone,
    pendingPolygon,
    modalSaving,
    fetchZones: store.fetchAll,
    selectZone,
    handleDrawFinish,
    handleEditParams,
    closeModal,
    saveZone,
    deleteZone,
    handleGeometrySave,
  })
}
