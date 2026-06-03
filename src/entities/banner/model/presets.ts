import sale from '@/assets/sale.jpeg'
import cashback from '@/assets/cashback.jpeg'
import freedelivery from '@/assets/freedelivery.jpeg'
import deliverytime from '@/assets/deliverytime.jpeg'
import day from '@/assets/day.jpeg'

export interface IBannerPreset {
  id: string
  label: string
  src: string
}

/**
 * Bundled banner images. Stored in a banner as `preset:<id>` so persisted state
 * survives Vite asset re-hashing between builds — the resolved URL is looked up at render.
 */
export const BANNER_PRESETS: IBannerPreset[] = [
  { id: 'sale', label: 'Распродажа', src: sale },
  { id: 'cashback', label: 'Кешбэк', src: cashback },
  { id: 'freedelivery', label: 'Бесплатная доставка', src: freedelivery },
  { id: 'deliverytime', label: 'Быстрая доставка', src: deliverytime },
  { id: 'day', label: 'Блюдо дня', src: day },
]

const PRESET_PREFIX = 'preset:'
const presetMap = new Map(BANNER_PRESETS.map((p) => [p.id, p.src]))

export function presetKey(id: string): string {
  return `${PRESET_PREFIX}${id}`
}

export function isPresetKey(image: string): boolean {
  return image.startsWith(PRESET_PREFIX)
}

/** Maps a stored `image` value to a real URL: preset key → bundled asset, otherwise as-is. */
export function resolveBannerImage(image: string): string {
  if (!isPresetKey(image)) return image
  return presetMap.get(image.slice(PRESET_PREFIX.length)) ?? ''
}
