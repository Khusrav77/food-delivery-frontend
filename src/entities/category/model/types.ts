export interface Category {
  id: string
  name: string
  imageUrl: string | null   // maps to categories.image_url
  position: number          // maps to categories.position (was order)
  createdAt: string
  updatedAt: string
}
