export interface CartItem {
  menuItemId: string
  productId: string
  productName: string
  variantName: string
  price: number
  quantity: number
  image: string | null
}
