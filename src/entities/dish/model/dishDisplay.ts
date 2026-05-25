import { type Product, type MenuItem, SIZE_UNIT_LABELS } from './types'

export function getActiveItems(product: Product): MenuItem[] {
  return product.menuItems.filter(m => m.isActive)
}

export function getFirstImage(product: Product): string | null {
  for (const item of product.menuItems) {
    if (item.isActive && item.images.length > 0) return item.images[0].url
  }
  return null
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
