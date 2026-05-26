import type { Product } from '@/entities/dish'
import type { Category } from '@/entities/category'

export interface MenuSection {
  id: string
  name: string
  products: Product[]
}

export function groupIntoSections(
  products: Product[],
  categories: Category[],
): MenuSection[] {
  const visible = products.filter(p => p.isActive && p.menuItems.some(m => m.isActive))

  const sections: MenuSection[] = categories
    .map(cat => ({
      id: cat.id,
      name: cat.name,
      products: visible.filter(p => p.categoryId === cat.id),
    }))
    .filter(s => s.products.length > 0)

  // Products without a category go to a catch-all section at the end
  const uncategorized = visible.filter(p => p.categoryId === null)
  if (uncategorized.length > 0) {
    sections.push({ id: 'uncategorized', name: 'Прочее', products: uncategorized })
  }

  return sections
}
