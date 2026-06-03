/** Минимальная гео-точка. Структурно совместима с entities IGeoPoint (shared не импортирует entities). */
export interface LatLng {
  lat: number
  lng: number
}

/**
 * Принадлежность точки полигону методом ray-casting.
 * Полигон — список вершин (не требует явного замыкания: последнее ребро соединяет
 * последнюю вершину с первой). Точки на ребре считаются внутри недетерминированно —
 * для определения зоны доставки это допустимо.
 */
export function pointInPolygon(point: LatLng, polygon: LatLng[]): boolean {
  if (polygon.length < 3) return false

  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng
    const yi = polygon[i].lat
    const xj = polygon[j].lng
    const yj = polygon[j].lat

    const intersects =
      yi > point.lat !== yj > point.lat &&
      point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi

    if (intersects) inside = !inside
  }
  return inside
}
