import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IAdminCustomer, IBonusAdjustment } from './types'
import { fetchCustomers, fetchCustomer, adjustCustomerBonus } from '../api/customerApi'

export const useAdminCustomerStore = defineStore('adminCustomer', () => {
  const list    = ref<IAdminCustomer[]>([])
  const current = ref<IAdminCustomer | null>(null)

  const loadingList    = ref(false)
  const loadingCurrent = ref(false)
  const listError      = ref<string | null>(null)
  const currentError   = ref<string | null>(null)

  function sync(customer: IAdminCustomer): void {
    if (current.value?.id === customer.id) current.value = customer
    const i = list.value.findIndex((c) => c.id === customer.id)
    if (i !== -1) list.value[i] = customer
  }

  async function fetchAll(): Promise<void> {
    loadingList.value = true
    listError.value = null
    try {
      list.value = await fetchCustomers()
    } catch (e) {
      listError.value = (e as { message?: string }).message ?? 'Ошибка загрузки'
    } finally {
      loadingList.value = false
    }
  }

  async function fetchOne(id: string): Promise<void> {
    current.value = null
    loadingCurrent.value = true
    currentError.value = null
    try {
      current.value = await fetchCustomer(id)
    } catch (e) {
      currentError.value = (e as { message?: string }).message ?? 'Клиент не найден'
    } finally {
      loadingCurrent.value = false
    }
  }

  async function adjustBonus(id: string, payload: IBonusAdjustment): Promise<void> {
    const customer = await adjustCustomerBonus(id, payload)
    sync(customer)
  }

  return {
    list, current, loadingList, loadingCurrent, listError, currentError,
    fetchAll, fetchOne, adjustBonus,
  }
})
