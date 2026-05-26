import { type Product, type MenuItem, SIZE_UNIT_LABELS } from './types'

export function getActiveItems(product: Product): MenuItem[] {
  return product.menuItems.filter(m => m.isActive)
}

export function getPrimaryItem(product: Product): MenuItem | null {
  return getActiveItems(product)[0] ?? null
}

export function getFirstImage(product: Product): string | null {
  for (const item of product.menuItems) {
    if (item.isActive && item.images.length > 0) return item.images[0].url
  }
  return null
}

// Gallery for the card: images of the primary item, falling back to any active item that has them.
export function getGalleryImages(product: Product, max = 4): string[] {
  const primary = getPrimaryItem(product)
  const source =
    primary && primary.images.length > 0
      ? primary
      : getActiveItems(product).find(m => m.images.length > 0) ?? null
  if (!source) return []
  return source.images
    .slice()
    .sort((a, b) => a.position - b.position)
    .slice(0, max)
    .map(img => img.url)
}

// Size chips for the card: ["8 шт", "400 г"] from the primary item.
export function getSizeParts(item: MenuItem): string[] {
  return item.sizes.map(s => `${s.sizeValue} ${SIZE_UNIT_LABELS[s.sizeUnit]}`)
}

// Unique tag ids across all active items of a product.
export function getProductTagIds(product: Product): string[] {
  const seen = new Set<string>()
  for (const item of getActiveItems(product)) {
    for (const id of item.tagIds) seen.add(id)
  }
  return [...seen]
}

export function getMinPrice(product: Product): number {
  const items = getActiveItems(product)
  if (items.length === 0) return 0
  return Math.min(...items.map(m => m.price))
}

export function hasMultiplePrices(product: Product): boolean {
  const prices = new Set(getActiveItems(product).map(m => m.price))
  return prices.size > 1
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString('ru-RU')} ₽`
}

export function formatItemLabel(item: MenuItem): string {
  if (item.sizes.length === 0) return item.name
  const sizes = item.sizes.map(s => `${s.sizeValue} ${SIZE_UNIT_LABELS[s.sizeUnit]}`).join(', ')
  return `${item.name} · ${sizes}`
}
