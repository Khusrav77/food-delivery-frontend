import type { Tag, TagColor } from './types'

// Backend stores only the tag label — color/emoji are UI-only and often unset.
// This gives well-known labels (новинка/хит/острое) a sensible default look.
const KNOWN_TAG_STYLES: Record<string, { color: TagColor; emoji?: string }> = {
  'новинка': { color: 'green' },
  'новое': { color: 'green' },
  'хит': { color: 'orange' },
  'хит продаж': { color: 'orange' },
  'популярное': { color: 'orange' },
  'острое': { color: 'red' },
  'острый': { color: 'red' },
  'веган': { color: 'emerald' },
  'вегетарианское': { color: 'emerald' },
  'акция': { color: 'red' },
  'скидка': { color: 'red' },
}

export function resolveTagStyle(tag: Tag): { color: TagColor; emoji?: string } {
  const known = KNOWN_TAG_STYLES[tag.label.trim().toLowerCase()]
  return {
    color: tag.color ?? known?.color ?? 'orange',
    emoji: tag.emoji ?? known?.emoji,
  }
}
