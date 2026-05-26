import type { Product } from '@/entities/dish'
import type { MenuItemDraft } from './types'

export function defaultMenuItemDraft(): MenuItemDraft {
  return {
    id: `draft-${Date.now()}`,
    name: '',
    price: 0,
    isActive: true,
    imageUrls: [''],
    sizes: [],
    tagIds: [],
  }
}

export function productToDraft(mi: Product['menuItems'][number]): MenuItemDraft {
  return {
    id: mi.id,
    name: mi.name,
    price: mi.price,
    isActive: mi.isActive,
    imageUrls: mi.images.length ? mi.images.map(img => img.url) : [''],
    sizes: mi.sizes.map(s => ({ sizeType: s.sizeType, sizeValue: s.sizeValue, sizeUnit: s.sizeUnit })),
    tagIds: [...mi.tagIds],
  }
}

export function draftToMenuItem(
  draft: MenuItemDraft,
  idx: number,
  productId = '',
): Product['menuItems'][number] {
  return {
    id: draft.id.startsWith('draft-') ? `mi${Date.now()}${idx}` : draft.id,
    productId,
    name: draft.name.trim(),
    price: draft.price,
    isActive: draft.isActive,
    position: idx + 1,
    images: draft.imageUrls
      .filter(u => u.trim())
      .map((url, i) => ({ id: `img${Date.now()}${i}`, menuItemId: '', url, position: i + 1 })),
    sizes: draft.sizes
      .filter(s => s.sizeValue > 0)
      .map((s, i) => ({ ...s, id: `sz${Date.now()}${i}`, menuItemId: '' })),
    tagIds: draft.tagIds,
  }
}

export function validateDishForm(
  name: string,
  menuItems: MenuItemDraft[],
): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!name.trim()) errors.name = 'Введите название'
  if (menuItems.length === 0) {
    errors.items = 'Добавьте хотя бы один вариант'
  } else {
    for (const mi of menuItems) {
      if (!mi.name.trim()) { errors.items = 'Заполните название варианта'; break }
      if (!mi.price || mi.price <= 0) { errors.items = 'Укажите цену варианта'; break }
    }
  }
  return errors
}