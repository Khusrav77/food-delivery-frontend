import { ref, onMounted, onUnmounted } from 'vue'
import { PROMO_SLIDES } from '../config/promoSlides'

export function usePromoCarousel() {
  const activeIndex = ref(0)
  const isPaused = ref(false)
  const count = PROMO_SLIDES.length
  let timer: ReturnType<typeof setInterval> | null = null

  function goTo(index: number) {
    activeIndex.value = ((index % count) + count) % count
  }

  function next() { goTo(activeIndex.value + 1) }
  function prev() { goTo(activeIndex.value - 1) }
  function pause() { isPaused.value = true }
  function resume() { isPaused.value = false }

  onMounted(() => {
    timer = setInterval(() => {
      if (!isPaused.value) next()
    }, 4500)
  })

  onUnmounted(() => {
    if (timer !== null) clearInterval(timer)
  })

  return { activeIndex, slides: PROMO_SLIDES, goTo, next, prev, pause, resume }
}
