import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IDeliveryZone, IGeoPoint, IZoneDraft } from './types'
import {
  fetchDeliveryZones,
  createDeliveryZone,
  updateDeliveryZone,
  updateDeliveryZonePolygon,
  deleteDeliveryZone,
} from '../api/deliveryZoneApi'

export const useAdminZoneStore = defineStore('adminDeliveryZone', () => {
  const list         = ref<IDeliveryZone[]>([])
  const loadingList  = ref(false)
  const listError    = ref<string | null>(null)

  function sync(zone: IDeliveryZone): void {
    const i = list.value.findIndex((z) => z.id === zone.id)
    if (i !== -1) list.value[i] = zone
    else list.value.push(zone)
  }

  async function fetchAll(): Promise<void> {
    loadingList.value = true
    listError.value = null
    try { list.value = await fetchDeliveryZones() }
    catch (e) { listError.value = (e as { message?: string }).message ?? 'Ошибка загрузки' }
    finally { loadingList.value = false }
  }

  async function create(draft: IZoneDraft, polygon: IGeoPoint[]): Promise<IDeliveryZone> {
    const zone = await createDeliveryZone(draft, polygon)
    sync(zone)
    return zone
  }

  async function update(id: string, draft: IZoneDraft): Promise<IDeliveryZone> {
    const zone = await updateDeliveryZone(id, draft)
    sync(zone)
    return zone
  }

  async function updatePolygon(id: string, polygon: IGeoPoint[]): Promise<void> {
    const zone = await updateDeliveryZonePolygon(id, polygon)
    sync(zone)
  }

  async function remove(id: string): Promise<void> {
    await deleteDeliveryZone(id)
    list.value = list.value.filter((z) => z.id !== id)
  }

  return { list, loadingList, listError, fetchAll, create, update, updatePolygon, remove }
})
