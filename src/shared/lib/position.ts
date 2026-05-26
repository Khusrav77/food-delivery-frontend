export interface Positioned {
  id: string
  position: number
}

/** Returns a new array sorted by `position` ascending; ties keep their original order. */
export function sortByPosition<T extends { position: number }>(items: readonly T[]): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => a.item.position - b.item.position || a.index - b.index)
    .map(({ item }) => item)
}

/**
 * Reassigns a clean `0..n-1` sequence to the given visual order and returns only
 * the items whose position actually changed — the minimal set to persist.
 */
export function diffChanged<T extends Positioned>(
  ordered: readonly T[],
): { id: string; position: number }[] {
  const changed: { id: string; position: number }[] = []
  ordered.forEach((item, index) => {
    if (item.position !== index) changed.push({ id: item.id, position: index })
  })
  return changed
}
