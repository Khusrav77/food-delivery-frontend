import { onUnmounted } from 'vue'
import type { Ref } from 'vue'
import L from 'leaflet'
import type { ICity } from '@/entities/delivery-location'
import type { IDeliveryZone } from '@/entities/delivery-zone'
import { ZONE_TYPE_META } from '@/entities/delivery-zone'

interface Callbacks {
  /** Пин перемещён пользователем (drag завершён или клик по карте). */
  onPinMove: (lat: number, lng: number) => void
}

// divIcon вместо стандартного маркера — обходит проблему битых путей к ассетам Leaflet под Vite.
const PIN_ICON = L.divIcon({
  html: `<div style="width:22px;height:22px;border-radius:50% 50% 50% 0;background:#f97316;
                     transform:rotate(-45deg);border:2.5px solid white;
                     box-shadow:0 2px 6px rgba(0,0,0,.35);cursor:grab;"></div>`,
  className: '',
  iconSize: [22, 22],
  iconAnchor: [11, 22],
})

export function useLocationMap(containerRef: Ref<HTMLElement | null>, callbacks: Callbacks) {
  let map: L.Map | null = null
  let marker: L.Marker | null = null
  let zoneLayers: L.Polygon[] = []

  function initMap(city: ICity, pin: { lat: number; lng: number }): void {
    if (!containerRef.value || map) return

    map = L.map(containerRef.value, { center: [city.lat, city.lng], zoom: city.zoom })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    map.on('click', (e: L.LeafletMouseEvent) => {
      setPin(e.latlng.lat, e.latlng.lng)
      callbacks.onPinMove(e.latlng.lat, e.latlng.lng)
    })

    setPin(pin.lat, pin.lng)
  }

  function setPin(lat: number, lng: number): void {
    if (!map) return
    if (!marker) {
      marker = L.marker([lat, lng], { draggable: true, icon: PIN_ICON }).addTo(map)
      marker.on('dragend', () => {
        const ll = marker!.getLatLng()
        callbacks.onPinMove(ll.lat, ll.lng)
      })
    } else {
      marker.setLatLng([lat, lng])
    }
  }

  /** Передвинуть пин и отцентровать карту (после выбора подсказки). */
  function focusPin(lat: number, lng: number, zoom?: number): void {
    setPin(lat, lng)
    map?.setView([lat, lng], zoom ?? map.getZoom())
  }

  /** Сменить город: рецентр + пин в центр города. */
  function recenter(city: ICity): void {
    if (!map) return
    map.setView([city.lat, city.lng], city.zoom)
    setPin(city.lat, city.lng)
  }

  function renderZones(zones: IDeliveryZone[]): void {
    if (!map) return
    zoneLayers.forEach((l) => map!.removeLayer(l))
    zoneLayers = []
    for (const zone of zones) {
      const meta = ZONE_TYPE_META[zone.type]
      const poly = L.polygon(
        zone.polygon.map((p) => [p.lat, p.lng] as L.LatLngTuple),
        { color: meta.color, fillColor: meta.fillColor, fillOpacity: 0.25, weight: 1.5, interactive: false },
      ).addTo(map)
      zoneLayers.push(poly)
    }
  }

  /** Пересчитать размеры тайлов — карта инициализируется внутри модалки до её анимации. */
  function invalidateSize(): void {
    map?.invalidateSize()
  }

  onUnmounted(() => {
    map?.remove()
    map = null
    marker = null
    zoneLayers = []
  })

  return { initMap, setPin, focusPin, recenter, renderZones, invalidateSize }
}
