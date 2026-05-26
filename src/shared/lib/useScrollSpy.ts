import { ref, watch, onMounted, onBeforeUnmount, nextTick, type Ref } from 'vue'

export function useScrollSpy(ids: Ref<string[]>, topOffset = 0) {
  const activeId = ref<string | null>(null)
  let observer: IntersectionObserver | null = null
  const visible = new Set<string>()

  function setup() {
    observer?.disconnect()
    visible.clear()

    if (!ids.value.length) {
      activeId.value = null
      return
    }

    observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        // Pick topmost visible section (by document order = ids order)
        const first = ids.value.find(id => visible.has(id))
        if (first) activeId.value = first
      },
      // Band just below the sticky strip; -65% bottom cuts off sections not yet reached
      { rootMargin: `-${topOffset}px 0px -65% 0px`, threshold: 0 },
    )

    for (const id of ids.value) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
  }

  onMounted(() => setup())
  onBeforeUnmount(() => observer?.disconnect())

  // Re-observe when section list changes (e.g. after products load)
  watch(ids, async () => {
    await nextTick()
    setup()
  })

  function scrollToId(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - topOffset
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return { activeId, scrollToId }
}
