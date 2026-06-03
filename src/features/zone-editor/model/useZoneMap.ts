import { ref, watch, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import L from 'leaflet'
import type { IDeliveryZone, IGeoPoint } from '@/entities/delivery-zone'
import { ZONE_TYPE_META } from '@/entities/delivery-zone'

export type MapMode = 'idle' | 'drawing' | 'editing'

interface Callbacks {
  onSelect: (id: string | null) => void
  onDrawFinish: (points: IGeoPoint[]) => void
  onGeometrySave: (id: string, points: IGeoPoint[]) => void
}

export function useZoneMap(
  containerRef: Ref<HTMLElement | null>,
  getZones: () => IDeliveryZone[],
  getSelectedId: () => string | null,
  callbacks: Callbacks,
) {
  let map: L.Map | null = null

  const zoneLayers = new Map<string, L.Polygon>()

  const mode           = ref<MapMode>('idle')
  const drawingPoints  = ref<IGeoPoint[]>([])
  const editingZoneId  = ref<string | null>(null)

  // Mutable drawing / editing layers (not reactive — purely imperative)
  let drawVertexMarkers: L.CircleMarker[] = []
  let drawPolyline:      L.Polyline | null = null
  let drawClosingLine:   L.Polyline | null = null
  let editVertexMarkers: L.Marker[]  = []
  let editPreviewPoly:   L.Polygon   | null = null
  let editPoints:        IGeoPoint[] = []

  // ─── Init ────────────────────────────────────────────────────────────────

  function initMap(): void {
    if (!containerRef.value || map) return

    map = L.map(containerRef.value, { center: [59.9343, 30.3351], zoom: 11 })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    map.on('click', onMapClick)
    renderZones()
  }

  // ─── Zone rendering ───────────────────────────────────────────────────────

  function renderZones(): void {
    if (!map) return
    zoneLayers.forEach((layer) => map!.removeLayer(layer))
    zoneLayers.clear()
    for (const zone of getZones()) addZoneLayer(zone)
  }

  function addZoneLayer(zone: IDeliveryZone): void {
    if (!map) return
    const meta     = ZONE_TYPE_META[zone.type]
    const selected = zone.id === getSelectedId()

    const polygon = L.polygon(
      zone.polygon.map((p) => [p.lat, p.lng] as L.LatLngTuple),
      {
        color:       meta.color,
        fillColor:   meta.fillColor,
        fillOpacity: 0.4,
        weight:      selected ? 3 : 1.5,
        dashArray:   zone.type === 'none' ? '8 5' : undefined,
      },
    )

    polygon.on('click', () => { if (mode.value === 'idle') callbacks.onSelect(zone.id) })
    polygon.addTo(map!)
    zoneLayers.set(zone.id, polygon)
  }

  function refreshZoneStyle(zoneId: string): void {
    const zone  = getZones().find((z) => z.id === zoneId)
    const layer = zoneLayers.get(zoneId)
    if (!zone || !layer) return
    const meta     = ZONE_TYPE_META[zone.type]
    const selected = zone.id === getSelectedId()
    layer.setStyle({ color: meta.color, fillColor: meta.fillColor, fillOpacity: 0.4, weight: selected ? 3 : 1.5 })
  }

  // ─── Drawing ─────────────────────────────────────────────────────────────

  function onMapClick(e: L.LeafletMouseEvent): void {
    if (mode.value !== 'drawing') return
    drawingPoints.value = [...drawingPoints.value, { lat: e.latlng.lat, lng: e.latlng.lng }]
    syncDrawPreview()
  }

  function syncDrawPreview(): void {
    if (!map) return
    clearDrawLayers()

    const pts = drawingPoints.value
    if (pts.length === 0) return

    for (const pt of pts) {
      drawVertexMarkers.push(
        L.circleMarker([pt.lat, pt.lng], {
          radius: 5, color: '#6366f1', fillColor: '#6366f1', fillOpacity: 1, weight: 2,
        }).addTo(map!),
      )
    }

    if (pts.length >= 2) {
      drawPolyline = L.polyline(
        pts.map((p) => [p.lat, p.lng] as L.LatLngTuple),
        { color: '#6366f1', weight: 2, dashArray: '6 4' },
      ).addTo(map!)
    }

    if (pts.length >= 3) {
      drawClosingLine = L.polyline(
        [[pts.at(-1)!.lat, pts.at(-1)!.lng], [pts[0].lat, pts[0].lng]] as L.LatLngTuple[],
        { color: '#6366f1', weight: 1.5, dashArray: '3 6', opacity: 0.4 },
      ).addTo(map!)
    }
  }

  function clearDrawLayers(): void {
    if (!map) return
    drawVertexMarkers.forEach((m) => map!.removeLayer(m))
    drawVertexMarkers = []
    if (drawPolyline)    { map.removeLayer(drawPolyline);    drawPolyline    = null }
    if (drawClosingLine) { map.removeLayer(drawClosingLine); drawClosingLine = null }
  }

  function startDrawing(): void {
    cancelEditing()
    mode.value = 'drawing'
    drawingPoints.value = []
    if (map) map.getContainer().style.cursor = 'crosshair'
  }

  function undoLastPoint(): void {
    if (mode.value !== 'drawing' || drawingPoints.value.length === 0) return
    drawingPoints.value = drawingPoints.value.slice(0, -1)
    syncDrawPreview()
  }

  function finishDrawing(): void {
    if (drawingPoints.value.length < 3) return
    const points = [...drawingPoints.value]
    clearDrawLayers()
    mode.value = 'idle'
    drawingPoints.value = []
    if (map) map.getContainer().style.cursor = ''
    callbacks.onDrawFinish(points)
  }

  function cancelDrawing(): void {
    clearDrawLayers()
    mode.value = 'idle'
    drawingPoints.value = []
    if (map) map.getContainer().style.cursor = ''
  }

  // ─── Editing ─────────────────────────────────────────────────────────────

  function startEditing(zoneId: string): void {
    if (!map) return
    cancelDrawing()
    cancelEditing()

    const zone = getZones().find((z) => z.id === zoneId)
    if (!zone) return

    mode.value = 'editing'
    editingZoneId.value = zoneId
    editPoints = zone.polygon.map((p) => ({ ...p }))

    syncEditPreview()

    editPoints.forEach((pt, i) => {
      const icon = L.divIcon({
        html: `<div style="width:12px;height:12px;border-radius:50%;background:#6366f1;
                          border:2.5px solid white;box-shadow:0 1px 4px rgba(0,0,0,.35);
                          cursor:grab;"></div>`,
        className: '',
        iconSize:   [12, 12],
        iconAnchor: [6, 6],
      })

      const marker = L.marker([pt.lat, pt.lng], { draggable: true, icon })
      marker.on('drag', () => {
        const ll = marker.getLatLng()
        editPoints[i] = { lat: ll.lat, lng: ll.lng }
        syncEditPreview()
      })
      marker.addTo(map!)
      editVertexMarkers.push(marker)
    })
  }

  function syncEditPreview(): void {
    if (!map) return
    if (editPreviewPoly) { map.removeLayer(editPreviewPoly); editPreviewPoly = null }
    if (editPoints.length < 2) return
    editPreviewPoly = L.polygon(
      editPoints.map((p) => [p.lat, p.lng] as L.LatLngTuple),
      { color: '#6366f1', fillColor: '#6366f115', fillOpacity: 1, weight: 2, dashArray: '7 4' },
    ).addTo(map!)
  }

  function saveEditing(): void {
    if (!editingZoneId.value) return
    const id     = editingZoneId.value
    const points = editPoints.map((p) => ({ ...p }))
    clearEditLayers()
    mode.value = 'idle'
    editingZoneId.value = null
    editPoints = []
    callbacks.onGeometrySave(id, points)
  }

  function cancelEditing(): void {
    clearEditLayers()
    mode.value = 'idle'
    editingZoneId.value = null
    editPoints = []
  }

  function clearEditLayers(): void {
    if (!map) return
    editVertexMarkers.forEach((m) => map!.removeLayer(m))
    editVertexMarkers = []
    if (editPreviewPoly) { map.removeLayer(editPreviewPoly); editPreviewPoly = null }
  }

  // ─── Watchers ─────────────────────────────────────────────────────────────

  watch(getZones, () => { if (mode.value === 'idle') renderZones() }, { deep: true })

  watch(getSelectedId, (newId, oldId) => {
    if (oldId) refreshZoneStyle(oldId)
    if (newId) refreshZoneStyle(newId)
  })

  onUnmounted(() => { map?.remove(); map = null })

  return {
    mode,
    drawingPoints,
    editingZoneId,
    initMap,
    startDrawing,
    undoLastPoint,
    finishDrawing,
    cancelDrawing,
    startEditing,
    saveEditing,
    cancelEditing,
  }
}
