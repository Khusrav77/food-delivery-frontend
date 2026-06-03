import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { OrderRating, PlacedOrder, PlaceOrderPayload } from './types'
import {
  createOrder,
  fetchOrders,
  fetchOrder,
  cancelOrder,
  submitRating,
  advanceOrderStatus,
} from '../api/orderApi'

export const useOrderStore = defineStore('order', () => {
  const lastOrder = ref<PlacedOrder | null>(null)
  const placing = ref(false)
  const error = ref<string | null>(null)

  const list = ref<PlacedOrder[]>([])
  const loadingList = ref(false)
  const listError = ref<string | null>(null)

  const current = ref<PlacedOrder | null>(null)
  const loadingCurrent = ref(false)
  const currentError = ref<string | null>(null)

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
    currentError.value = null
    try {
      current.value = await fetchOrder(id)
    } catch (e) {
      currentError.value = (e as { message?: string }).message ?? 'Ошибка загрузки заказа'
    } finally {
      loadingCurrent.value = false
    }
  }

  // Держим current и соответствующий элемент list синхронными после мутаций статуса/оценки.
  function sync(order: PlacedOrder): void {
    if (current.value?.id === order.id) current.value = order
    const i = list.value.findIndex((o) => o.id === order.id)
    if (i !== -1) list.value[i] = order
    if (lastOrder.value?.id === order.id) lastOrder.value = order
  }

  async function cancel(id: string): Promise<PlacedOrder> {
    const order = await cancelOrder(id)
    sync(order)
    return order
  }

  async function rate(id: string, payload: OrderRating): Promise<PlacedOrder> {
    const order = await submitRating(id, payload)
    sync(order)
    return order
  }

  async function advanceCurrent(): Promise<PlacedOrder | null> {
    if (!current.value) return null
    const order = await advanceOrderStatus(current.value.id)
    sync(order)
    return order
  }

  return {
    lastOrder, placing, error, place,
    list, loadingList, listError, fetchAll,
    current, loadingCurrent, currentError, fetchOne,
    cancel, rate, advanceCurrent,
  }
})
