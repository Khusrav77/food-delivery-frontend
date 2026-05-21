// maps to menu_item_sizes
export interface MenuItemSize {
  id: string
  menuItemId: string
  sizeType: SizeType      // "weight" | "volume" | "diameter" | "count"
  sizeValue: number       // 200, 400, 20, 30
  sizeUnit: SizeUnit      // "gram" | "kg" | "ml" | "l" | "cm" | "piece"
}

// maps to menu_item_images
export interface MenuItemImage {
  id: string
  menuItemId: string
  url: string
  position: number
}

// maps to menu_items + joined menu_item_images, menu_item_sizes, menu_item_tags
export interface MenuItem {
  id: string
  productId: string
  name: string            // "4 шт", "8 шт", "20 см"
  price: number
  isActive: boolean
  position: number
  images: MenuItemImage[]
  sizes: MenuItemSize[]
  tagIds: string[]        // IDs from tags via menu_item_tags
}

// maps to products + joined menu_items
export interface Product {
  id: string
  categoryId: string | null
  name: string
  description: string
  isActive: boolean
  position: number
  createdAt: string
  updatedAt: string
  menuItems: MenuItem[]
}

export type SizeType = 'weight' | 'volume' | 'diameter' | 'count'
export type SizeUnit = 'gram' | 'kg' | 'ml' | 'l' | 'cm' | 'piece'

export const SIZE_UNIT_BY_TYPE: Record<SizeType, SizeUnit[]> = {
  weight: ['gram', 'kg'],
  volume: ['ml', 'l'],
  diameter: ['cm'],
  count: ['piece'],
}

export const SIZE_TYPE_LABELS: Record<SizeType, string> = {
  weight: 'Вес',
  volume: 'Объём',
  diameter: 'Диаметр',
  count: 'Кол-во',
}

export const SIZE_UNIT_LABELS: Record<SizeUnit, string> = {
  gram: 'г',
  kg: 'кг',
  ml: 'мл',
  l: 'л',
  cm: 'см',
  piece: 'шт',
}
