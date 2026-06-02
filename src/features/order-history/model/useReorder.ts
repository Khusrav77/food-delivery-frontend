import { ref } from 'vue'
import { useCartStore } from '@/entities/cart'
import { useToastStore } from '@/shared/lib/toast'
import type { PlacedOrder } from '@/entities/order'

export function useReorder() {
  const cart = useCartStore()
  const toast = useToastStore()
  const loading = ref(false)

  async function reorder(order: PlacedOrder): Promise<void> {
    loading.value = true
    try {
      cart.clearCart()
      for (const item of order.payload.items) {
        cart.addItem({
          menuItemId: item.menuItemId,
          productId: item.productId,
          productName: item.productName,
          variantName: item.variantName,
          price: item.price,
          image: item.image,
        })
        // addItem увеличивает qty на 1 за вызов, поэтому повторяем если qty > 1
        for (let q = 1; q < item.quantity; q++) {
          cart.addItem({
            menuItemId: item.menuItemId,
            productId: item.productId,
            productName: item.productName,
            variantName: item.variantName,
            price: item.price,
            image: item.image,
          })
        }
      }
      toast.success(`Заказ №${order.number} добавлен в корзину`)
    } finally {
      loading.value = false
    }
  }

  return { loading, reorder }
}
