import type { MenuItemSize } from '@/entities/dish'

export interface MenuItemDraft {
  id: string
  name: string
  price: number
  isActive: boolean
  imageUrls: string[]
  sizes: Omit<MenuItemSize, 'id' | 'menuItemId'>[]
  tagIds: string[]
}