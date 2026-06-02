import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { AdminOrder, OrderStatus } from './types'
import {
  fetchAdminOrders,
  fetchAdminOrder,
  updateOrderStatus,
  assignCourier,
} from '../api/adminOrderApi'

export const useAdminOrderStore = defineStore('adminOrder', () => {
  const list    = ref<AdminOrder[]>([])
  const current = ref<AdminOrder | null>(null)

  const loadingList    = ref(false)
  const loadingCurrent = ref(false)
  const listError      = ref<string | null>(null)
  const currentError   = ref<string | null>(null)

  // Держим current и соответствующий элемент list синхронными после мутаций.
  function sync(order: AdminOrder): void {
    if (current.value?.id === order.id) current.value = order
    const i = list.value.findIndex((o) => o.id === order.id)
    if (i !== -1) list.value[i] = order
  }

  async function fetchAll(): Promise<void> {
    loadingList.value = true
    listError.value = null
    try {
      list.value = await fetchAdminOrders()
    } catch (e) {
      listError.value = (e as { message?: string }).message ?? 'Ошибка загрузки'
    } finally {
      loadingList.value = false
    }
  }

  async function fetchOne(id: string): Promise<void> {
    loadingCurrent.value = true
    currentError.value = null
    try {
      current.value = await fetchAdminOrder(id)
    } catch (e) {
      currentError.value = (e as { message?: string }).message ?? 'Заказ не найден'
    } finally {
      loadingCurrent.value = false
    }
  }

  async function changeStatus(id: string, status: OrderStatus): Promise<void> {
    const order = await updateOrderStatus(id, status)
    sync(order)
  }

  async function setCourier(id: string, courierId: string | null): Promise<void> {
    const order = await assignCourier(id, courierId)
    sync(order)
  }

  return {
    list, current, loadingList, loadingCurrent, listError, currentError,
    fetchAll, fetchOne, changeStatus, setCourier,
  }
})
