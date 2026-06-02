import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { PlacedOrder, PlaceOrderPayload } from './types'
import { createOrder } from '../api/orderApi'

export const useOrderStore = defineStore('order', () => {
  const lastOrder = ref<PlacedOrder | null>(null)
  const placing = ref(false)
  const error = ref<string | null>(null)

  async function place(payload: PlaceOrderPayload): Promise<PlacedOrder> {
    placing.value = true
    error.value = null
    try {
      const order = await createOrder(payload)
      lastOrder.value = order
      return order
    } catch (e) {
      error.value = (e as { message?: string }).message ?? 'Не удалось оформить заказ'
      throw e
    } finally {
      placing.value = false
    }
  }

  return { lastOrder, placing, error, place }
})
