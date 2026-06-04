// Fly-to-cart UX: a product image clone flies in an arc from the source element
// to the currently visible cart target, then the target pulses.
// Targets opt in via the `data-fly-cart-target` attribute (header on desktop,
// tab bar on mobile) — only one is visible at a time, so we pick the rendered one.

const TARGET_SELECTOR = '[data-fly-cart-target]'
const CLONE_SIZE = 56
const FLY_DURATION = 700
const PULSE_DURATION = 320

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** First target that is actually rendered (responsive siblings hide via display:none). */
function visibleTarget(): HTMLElement | null {
  const targets = document.querySelectorAll<HTMLElement>(TARGET_SELECTOR)
  for (const el of targets) {
    if (el.getClientRects().length > 0) return el
  }
  return null
}

function pulse(target: HTMLElement): void {
  target.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(1.28)' },
      { transform: 'scale(1)' },
    ],
    { duration: PULSE_DURATION, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  )
}

/**
 * Animate a flying clone of the product image into the cart icon.
 * No-op (or pulse only) when reduced motion is preferred or no target is visible.
 */
export function flyToCart(source: HTMLElement | null, imageUrl: string | null): void {
  if (!source) return
  const target = visibleTarget()
  if (!target) return
  if (prefersReducedMotion()) {
    pulse(target)
    return
  }

  const from = source.getBoundingClientRect()
  const to = target.getBoundingClientRect()

  const clone = document.createElement('div')
  clone.style.position = 'fixed'
  clone.style.left = `${from.left + from.width / 2 - CLONE_SIZE / 2}px`
  clone.style.top = `${from.top + from.height / 2 - CLONE_SIZE / 2}px`
  clone.style.width = `${CLONE_SIZE}px`
  clone.style.height = `${CLONE_SIZE}px`
  clone.style.borderRadius = '9999px'
  clone.style.zIndex = '9999'
  clone.style.pointerEvents = 'none'
  clone.style.boxShadow = '0 10px 28px rgba(0,0,0,0.28)'
  clone.style.backgroundColor = 'var(--color-accent, #fb923c)'
  if (imageUrl) {
    clone.style.backgroundImage = `url("${imageUrl}")`
    clone.style.backgroundSize = 'cover'
    clone.style.backgroundPosition = 'center'
  }
  document.body.appendChild(clone)

  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)

  const animation = clone.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 60}px) scale(0.7)`, opacity: 1, offset: 0.6 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.15)`, opacity: 0.3 },
    ],
    { duration: FLY_DURATION, easing: 'cubic-bezier(0.42, 0, 0.58, 1)' },
  )

  animation.onfinish = () => {
    clone.remove()
    pulse(target)
  }
}
