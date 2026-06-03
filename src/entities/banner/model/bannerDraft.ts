import type { IBanner, IBannerDraft, IBannerDraftErrors } from './types'
import { presetKey } from './presets'

export function defaultDraft(): IBannerDraft {
  return {
    image: presetKey('sale'),
    title: '',
    subtitle: '',
    ctaLabel: 'Заказать',
    href: '/',
    badge: '',
    showOverlay: true,
    isActive: true,
  }
}

export function validateDraft(d: IBannerDraft): IBannerDraftErrors {
  const errors: IBannerDraftErrors = {}
  if (!d.image.trim()) errors.image = 'Выберите картинку или вставьте URL'
  if (d.showOverlay && !d.title.trim()) errors.title = 'Заголовок обязателен при текстовом оверлее'
  return errors
}

export function bannerToDraft(b: IBanner): IBannerDraft {
  return {
    image: b.image,
    title: b.title,
    subtitle: b.subtitle,
    ctaLabel: b.ctaLabel,
    href: b.href,
    badge: b.badge,
    showOverlay: b.showOverlay,
    isActive: b.isActive,
  }
}

export function draftToBanner(d: IBannerDraft, base: { id: string; position: number }): IBanner {
  return {
    id: base.id,
    position: base.position,
    image: d.image.trim(),
    title: d.title.trim(),
    subtitle: d.subtitle.trim(),
    ctaLabel: d.ctaLabel.trim(),
    href: d.href.trim(),
    badge: d.badge.trim(),
    showOverlay: d.showOverlay,
    isActive: d.isActive,
  }
}
