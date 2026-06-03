import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { IBanner, IBannerDraft } from './types'
import { draftToBanner } from './bannerDraft'
import { SEED_BANNERS } from './seed'

const STORAGE_KEY = 'foo:banners'

function isBanner(x: unknown): x is IBanner {
  if (!x || typeof x !== 'object') return false
  const b = x as Record<string, unknown>
  return typeof b.id === 'string' && typeof b.image === 'string' && typeof b.position === 'number'
}

function load(): IBanner[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return SEED_BANNERS.map((b) => ({ ...b }))
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isBanner) : []
  } catch {
    return SEED_BANNERS.map((b) => ({ ...b }))
  }
}

const byPosition = (a: IBanner, b: IBanner): number => a.position - b.position

export const useBannerStore = defineStore('banner', () => {
  const list = ref<IBanner[]>(load().sort(byPosition))

  /** Active banners in display order — consumed by the client carousel. */
  const visibleBanners = computed(() => list.value.filter((b) => b.isActive))

  function persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.value))
  }

  function nextPosition(): number {
    return list.value.reduce((max, b) => Math.max(max, b.position), -1) + 1
  }

  function create(draft: IBannerDraft): IBanner {
    const banner = draftToBanner(draft, { id: crypto.randomUUID(), position: nextPosition() })
    list.value = [...list.value, banner]
    persist()
    return banner
  }

  function update(id: string, draft: IBannerDraft): void {
    const existing = list.value.find((b) => b.id === id)
    if (!existing) return
    const updated = draftToBanner(draft, { id, position: existing.position })
    list.value = list.value.map((b) => (b.id === id ? updated : b))
    persist()
  }

  function remove(id: string): void {
    list.value = list.value.filter((b) => b.id !== id)
    persist()
  }

  function toggle(id: string): void {
    list.value = list.value.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    persist()
  }

  /** Reassign positions from a new ordering of ids (drag-and-drop result). */
  function reorder(orderedIds: string[]): void {
    const rank = new Map(orderedIds.map((id, i) => [id, i]))
    list.value = list.value
      .map((b) => ({ ...b, position: rank.get(b.id) ?? b.position }))
      .sort(byPosition)
    persist()
  }

  return { list, visibleBanners, create, update, remove, toggle, reorder }
})
