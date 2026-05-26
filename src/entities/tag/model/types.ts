export type TagColor = 'red' | 'orange' | 'green' | 'emerald' | 'blue' | 'violet' | 'yellow'

export interface Tag {
  id: string
  label: string   // maps to tags.label in DB
  // UI-only fields — not stored in DB
  color?: TagColor
  emoji?: string
}
