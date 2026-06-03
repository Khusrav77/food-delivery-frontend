import { reactive, ref, computed, nextTick } from 'vue'
import type { Ref } from 'vue'
import { useDeliveryLocationStore, findCity, DEFAULT_CITY } from '@/entities/delivery-location'
import { useAdminZoneStore } from '@/entities/delivery-zone'
import { searchPlaces, reverseGeocode } from '@/shared/api/nominatim'
import type { GeoSuggestion } from '@/shared/api/nominatim'
import { useLocationMap } from './useLocationMap'
import {
  defaultDraft,
  draftFromLocation,
  applySuggestion,
  validateDraft,
  draftToLocation,
  resolveZoneByPoint,
} from './locationDraft'
import type { LocationDraft, LocationDraftErrors, ZoneResult } from './types'

const SEARCH_DEBOUNCE_MS = 400

export function useLocationPicker(containerRef: Ref<HTMLElement | null>, onSaved: () => void) {
  const locationStore = useDeliveryLocationStore()
  const zoneStore = useAdminZoneStore()

  const initial = locationStore.current
    ? draftFromLocation(locationStore.current)
    : defaultDraft(DEFAULT_CITY)
  const draft = reactive<LocationDraft>(initial)

  const query = ref('')
  const suggestions = ref<GeoSuggestion[]>([])
  const searching = ref(false)
  const searchError = ref<string | null>(null)

  const zoneChecked = ref(false)
  const zoneResult = ref<ZoneResult | null>(null)

  const errors = ref<LocationDraftErrors>({})
  const saving = ref(false)

  const selectedCity = computed(() => findCity(draft.cityId))

  const map = useLocationMap(containerRef, { onPinMove: handlePinMove })

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  async function open(): Promise<void> {
    if (!zoneStore.list.length) await zoneStore.fetchAll()
    await nextTick()
    map.initMap(selectedCity.value, { lat: draft.lat, lng: draft.lng })
    map.renderZones(zoneStore.list)
    // Карта монтируется внутри модалки — после её появления пересчитываем тайлы.
    setTimeout(() => map.invalidateSize(), 60)
    if (locationStore.current) recheckZone()
  }

  // ─── City ──────────────────────────────────────────────────────────────────

  function selectCity(id: string): void {
    const city = findCity(id)
    Object.assign(draft, defaultDraft(city))
    map.recenter(city)
    suggestions.value = []
    query.value = ''
    zoneChecked.value = false
    zoneResult.value = null
    errors.value = {}
  }

  // ─── Search (debounced) ──────────────────────────────────────────────────────

  let timer: ReturnType<typeof setTimeout> | null = null

  function onQueryInput(value: string): void {
    query.value = value
    if (timer) clearTimeout(timer)
    if (value.trim().length < 3) {
      suggestions.value = []
      return
    }
    timer = setTimeout(runSearch, SEARCH_DEBOUNCE_MS)
  }

  async function runSearch(): Promise<void> {
    searching.value = true
    searchError.value = null
    try {
      suggestions.value = await searchPlaces(query.value.trim(), selectedCity.value.name)
    } catch {
      searchError.value = 'Не удалось найти адрес. Попробуйте позже.'
      suggestions.value = []
    } finally {
      searching.value = false
    }
  }

  function pickSuggestion(s: GeoSuggestion): void {
    Object.assign(draft, applySuggestion(draft, s))
    suggestions.value = []
    query.value = ''
    map.focusPin(s.lat, s.lng, 16)
    recheckZone()
  }

  // ─── Pin move → reverse geocode ──────────────────────────────────────────────

  async function handlePinMove(lat: number, lng: number): Promise<void> {
    draft.lat = lat
    draft.lng = lng
    recheckZone()
    try {
      const place = await reverseGeocode(lat, lng)
      if (place) Object.assign(draft, applySuggestion(draft, { ...place, lat, lng }))
    } catch {
      // тихо игнорируем — координаты уже проставлены, адрес можно ввести вручную
    }
  }

  function recheckZone(): void {
    zoneChecked.value = true
    zoneResult.value = resolveZoneByPoint({ lat: draft.lat, lng: draft.lng }, zoneStore.list)
  }

  // ─── Save ────────────────────────────────────────────────────────────────────

  function save(): void {
    const e = validateDraft(draft)
    errors.value = e
    if (e.street || e.house) return
    saving.value = true
    locationStore.setLocation(draftToLocation(draft, selectedCity.value.name))
    saving.value = false
    onSaved()
  }

  return {
    draft,
    query,
    suggestions,
    searching,
    searchError,
    zoneChecked,
    zoneResult,
    errors,
    saving,
    selectedCity,
    open,
    selectCity,
    onQueryInput,
    pickSuggestion,
    save,
  }
}
