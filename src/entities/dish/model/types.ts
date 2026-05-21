export interface DishVariant {
  id: string
  label: string
  weight?: number
  price: number
  isDefault: boolean
}

export interface Dish {
  id: string
  name: string
  description: string
  imageUrl: string
  categoryId: string | null
  tagIds: string[]
  variants: DishVariant[]
  isAvailable: boolean
  createdAt: string
}
