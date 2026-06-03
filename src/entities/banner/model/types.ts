export interface IBanner {
  id: string
  /** Either a preset key `preset:<id>` or an external image URL. Resolved via resolveBannerImage. */
  image: string
  title: string
  subtitle: string
  ctaLabel: string
  /** CTA target route/url; '' = button is non-clickable. */
  href: string
  /** Corner badge text; '' = no badge. */
  badge: string
  /** Whether to render the text overlay over the image. */
  showOverlay: boolean
  isActive: boolean
  position: number
}

export interface IBannerDraft {
  image: string
  title: string
  subtitle: string
  ctaLabel: string
  href: string
  badge: string
  showOverlay: boolean
  isActive: boolean
}

export interface IBannerDraftErrors {
  image?: string
  title?: string
}
