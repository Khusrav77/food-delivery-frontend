import { ref, computed, watch, type Ref } from 'vue'

// Reactive gallery state shared by all card variants.
// Supports click-to-select dots and desktop hover-zone cycling (Airbnb-style).
export function useImageGallery(images: Ref<string[]>) {
  const index = ref(0)

  const count = computed(() => images.value.length)
  const hasGallery = computed(() => count.value > 1)
  const current = computed<string | null>(() => images.value[index.value] ?? images.value[0] ?? null)

  watch(count, () => { index.value = 0 })

  function select(i: number): void {
    if (i >= 0 && i < count.value) index.value = i
  }

  function reset(): void {
    index.value = 0
  }

  // Maps cursor X position over the image into a gallery index.
  function onHoverMove(e: MouseEvent): void {
    if (!hasGallery.value) return
    const el = e.currentTarget as HTMLElement
    const { left, width } = el.getBoundingClientRect()
    const ratio = (e.clientX - left) / width
    const next = Math.min(count.value - 1, Math.max(0, Math.floor(ratio * count.value)))
    index.value = next
  }

  return { index, count, hasGallery, current, select, reset, onHoverMove }
}
