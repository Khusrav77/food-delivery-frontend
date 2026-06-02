import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { IAddress } from './types'
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  removeAddress,
  setPrimaryAddress,
  type CreateAddressPayload,
} from '../api/addressApi'

export const useAddressStore = defineStore('address', () => {
  const list = ref<IAddress[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const primary = computed(
    () => list.value.find((a) => a.isPrimary) ?? list.value[0] ?? null,
  )

  async function fetchAll(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      list.value = await fetchAddresses()
    } catch (e) {
      error.value = (e as { message?: string }).message ?? 'Ошибка загрузки адресов'
    } finally {
      loading.value = false
    }
  }

  async function create(payload: CreateAddressPayload): Promise<void> {
    const addr = await createAddress(payload)
    list.value.push(addr)
  }

  async function update(id: string, payload: CreateAddressPayload): Promise<void> {
    const updated = await updateAddress(id, payload)
    const idx = list.value.findIndex((a) => a.id === id)
    if (idx !== -1) list.value[idx] = updated
  }

  async function remove(id: string): Promise<void> {
    await removeAddress(id)
    const wasPrimary = list.value.find((a) => a.id === id)?.isPrimary ?? false
    list.value = list.value.filter((a) => a.id !== id)
    if (wasPrimary && list.value.length > 0) list.value[0].isPrimary = true
  }

  async function setPrimary(id: string): Promise<void> {
    await setPrimaryAddress(id)
    list.value = list.value.map((a) => ({ ...a, isPrimary: a.id === id }))
  }

  return { list, loading, error, primary, fetchAll, create, update, remove, setPrimary }
})
