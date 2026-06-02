import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { PlacedOrder, PlaceOrderPayload } from './types'
import { createOrder, fetchOrders, fetchOrder } from '../api/orderApi'

export const useOrderStore = defineStore('order', () => {
  const lastOrder = ref<PlacedOrder | null>(null)
  const placing = ref(false)
  const error = ref<string | null>(null)

  const list = ref<PlacedOrder[]>([])
  const loadingList = ref(false)
  const listError = ref<string | null>(null)

  const current = ref<PlacedOrder | null>(null)
  const loadingCurrent = ref(false)

  async function place(payload: PlaceOrderPayload): Promise<PlacedOrder> {
    placing.value = true
    error.value = null
    try {
      const order = await createOrder(payload)
      lastOrder.value = order
      list.value.unshift(order)
      return order
    } catch (e) {
      error.value = (e as { message?: string }).message ?? 'Не удалось оформить заказ'
      throw e
    } finally {
      placing.value = false
    }
  }

  async function fetchAll(): Promise<void> {
    loadingList.value = true
    listError.value = null
    try {
      list.value = await fetchOrders()
    } catch (e) {
      listError.value = (e as { message?: string }).message ?? 'Ошибка загрузки заказов'
    } finally {
      loadingList.value = false
    }
  }

  async function fetchOne(id: string): Promise<void> {
    loadingCurrent.value = true
    try {
      current.value = await fetchOrder(id)
    } finally {
      loadingCurrent.value = false
    }
  }

  return {
    lastOrder, placing, error, place,
    list, loadingList, listError, fetchAll,
    current, loadingCurrent, fetchOne,
  }
})
