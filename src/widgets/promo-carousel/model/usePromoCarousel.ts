import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useBannerStore } from '@/entities/banner'

const GAP = 16
const AUTOPLAY_MS = 4000

export function usePromoCarousel(containerRef: Readonly<Ref<HTMLElement | null>>) {
  const { visibleBanners } = storeToRefs(useBannerStore())

  const containerWidth = ref(0)
  const offset = ref(0)

  const visible = computed(() => {
    if (containerWidth.value < 640) return 1
    if (containerWidth.value < 1024) return 2
    return 3
  })

  const maxOffset = computed(() => Math.max(0, visibleBanners.value.length - visible.value))

  const cardWidth = computed(() =>
    containerWidth.value > 0
      ? (containerWidth.value - (visible.value - 1) * GAP) / visible.value
      : 0,
  )

  const translateX = computed(() => offset.value * (cardWidth.value + GAP))

  // --- Autoplay ---
  let timer: ReturnType<typeof setInterval> | null = null

  function startAutoplay(): void {
    stopAutoplay()
    if (maxOffset.value === 0) return
    timer = setInterval(() => {
      offset.value = offset.value < maxOffset.value ? offset.value + 1 : 0
    }, AUTOPLAY_MS)
  }

  function stopAutoplay(): void {
    if (timer !== null) { clearInterval(timer); timer = null }
  }

  // --- Resize observer ---
  let ro: ResizeObserver | null = null

  onMounted(() => {
    if (!containerRef.value) return
    containerWidth.value = containerRef.value.clientWidth
    ro = new ResizeObserver(([entry]) => {
      containerWidth.value = entry.contentRect.width
      offset.value = Math.min(offset.value, maxOffset.value)
    })
    ro.observe(containerRef.value)
    startAutoplay()
  })

  onUnmounted(() => {
    ro?.disconnect()
    stopAutoplay()
  })

  // Reset timer on manual interaction so it doesn't jump immediately after user action.
  function prev(): void {
    offset.value = Math.max(0, offset.value - 1)
    startAutoplay()
  }

  function next(): void {
    offset.value = Math.min(maxOffset.value, offset.value + 1)
    startAutoplay()
  }

  function goTo(i: number): void {
    offset.value = i
    startAutoplay()
  }

  // --- Touch swipe ---
  let touchStartX = 0

  function onTouchStart(e: TouchEvent): void {
    touchStartX = e.touches[0].clientX
    stopAutoplay()
  }

  function onTouchEnd(e: TouchEvent): void {
    const delta = touchStartX - e.changedTouches[0].clientX
    if (Math.abs(delta) < 40) { startAutoplay(); return }
    if (delta > 0) next()
    else prev()
  }

  // --- Pause on hover ---
  function onMouseEnter(): void { stopAutoplay() }
  function onMouseLeave(): void { startAutoplay() }

  return {
    banners: visibleBanners,
    cardWidth,
    translateX,
    offset,
    maxOffset,
    visible,
    prev,
    next,
    goTo,
    onTouchStart,
    onTouchEnd,
    onMouseEnter,
    onMouseLeave,
  }
}
