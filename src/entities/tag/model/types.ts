export type TagColor = 'red' | 'orange' | 'green' | 'emerald' | 'blue' | 'violet' | 'yellow'

export interface Tag {
  id: string
  name: string
  color: TagColor
  emoji?: string
}
