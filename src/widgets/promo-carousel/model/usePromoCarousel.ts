import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'
import { PROMO_SLIDES } from '../config/promoSlides'

const GAP = 16

export function usePromoCarousel(containerRef: Readonly<Ref<HTMLElement | null>>) {
  const containerWidth = ref(0)
  const offset = ref(0)

  const visible = computed(() => {
    if (containerWidth.value < 640) return 1
    if (containerWidth.value < 1024) return 2
    return 3
  })

  const maxOffset = computed(() => Math.max(0, PROMO_SLIDES.length - visible.value))

  const cardWidth = computed(() =>
    containerWidth.value > 0
      ? (containerWidth.value - (visible.value - 1) * GAP) / visible.value
      : 0,
  )

  const translateX = computed(() => offset.value * (cardWidth.value + GAP))

  let ro: ResizeObserver | null = null

  onMounted(() => {
    if (!containerRef.value) return
    containerWidth.value = containerRef.value.clientWidth
    ro = new ResizeObserver(([entry]) => {
      containerWidth.value = entry.contentRect.width
      offset.value = Math.min(offset.value, maxOffset.value)
    })
    ro.observe(containerRef.value)
  })

  onUnmounted(() => ro?.disconnect())

  function prev() { offset.value = Math.max(0, offset.value - 1) }
  function next() { offset.value = Math.min(maxOffset.value, offset.value + 1) }

  // Touch swipe support
  let touchStartX = 0

  function onTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0].clientX
  }

  function onTouchEnd(e: TouchEvent) {
    const delta = touchStartX - e.changedTouches[0].clientX
    if (Math.abs(delta) < 40) return
    if (delta > 0) next()
    else prev()
  }

  return {
    slides: PROMO_SLIDES,
    cardWidth,
    translateX,
    offset,
    maxOffset,
    visible,
    prev,
    next,
    onTouchStart,
    onTouchEnd,
  }
}
