import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IAdminCourier, ICourierDraft } from './types'
import { fetchCouriers, fetchCourier, createCourier, updateCourier } from '../api/courierApi'

export const useAdminCourierStore = defineStore('adminCourier', () => {
  const list    = ref<IAdminCourier[]>([])
  const current = ref<IAdminCourier | null>(null)

  const loadingList    = ref(false)
  const loadingCurrent = ref(false)
  const listError      = ref<string | null>(null)
  const currentError   = ref<string | null>(null)

  function sync(courier: IAdminCourier): void {
    if (current.value?.id === courier.id) current.value = courier
    const i = list.value.findIndex((c) => c.id === courier.id)
    if (i !== -1) list.value[i] = courier
    else list.value.push(courier)
  }

  async function fetchAll(): Promise<void> {
    loadingList.value = true
    listError.value = null
    try { list.value = await fetchCouriers() }
    catch (e) { listError.value = (e as { message?: string }).message ?? 'Ошибка загрузки' }
    finally { loadingList.value = false }
  }

  async function fetchOne(id: string): Promise<void> {
    loadingCurrent.value = true
    currentError.value = null
    try { current.value = await fetchCourier(id) }
    catch (e) { currentError.value = (e as { message?: string }).message ?? 'Курьер не найден' }
    finally { loadingCurrent.value = false }
  }

  async function create(draft: ICourierDraft): Promise<IAdminCourier> {
    const courier = await createCourier(draft)
    sync(courier)
    return courier
  }

  async function update(id: string, draft: ICourierDraft): Promise<IAdminCourier> {
    const courier = await updateCourier(id, draft)
    sync(courier)
    return courier
  }

  return { list, current, loadingList, loadingCurrent, listError, currentError, fetchAll, fetchOne, create, update }
})
