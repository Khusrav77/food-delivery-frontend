import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { IDeliveryLocation } from './types'

const STORAGE_KEY = 'foo:delivery-location'

function load(): IDeliveryLocation | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const p = JSON.parse(raw) as Partial<IDeliveryLocation>
    if (typeof p.cityId !== 'string' || typeof p.lat !== 'number' || typeof p.lng !== 'number') {
      return null
    }
    return p as IDeliveryLocation
  } catch {
    return null
  }
}

export const useDeliveryLocationStore = defineStore('deliveryLocation', () => {
  const current = ref<IDeliveryLocation | null>(load())

  const hasLocation = computed(() => current.value !== null)

  /** Короткая строка для чипа в шапке: «улица, д. N» либо название города. */
  const shortLabel = computed(() => {
    const loc = current.value
    if (!loc) return ''
    if (loc.street) return `${loc.street}${loc.house ? `, ${loc.house}` : ''}`
    return loc.cityName
  })

  function setLocation(loc: IDeliveryLocation): void {
    current.value = loc
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc))
  }

  function clear(): void {
    current.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return { current, hasLocation, shortLabel, setLocation, clear }
})
