import type { OrderRating } from '@/entities/order'

export interface RatingDraft {
  stars: number
  comment: string
}

export function defaultDraft(): RatingDraft {
  return { stars: 0, comment: '' }
}

export function isValid(draft: RatingDraft): boolean {
  return draft.stars >= 1 && draft.stars <= 5
}

export function toRating(draft: RatingDraft): OrderRating {
  return { stars: draft.stars, comment: draft.comment.trim() }
}
