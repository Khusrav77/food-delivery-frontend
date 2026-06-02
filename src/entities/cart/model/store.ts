import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { formatPrice } from '@/shared/lib/money'
import type { CartItem } from './types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isOpen = ref(false)

  const count = computed(() => items.value.reduce((s, i) => s + i.quantity, 0))
  const total = computed(() => items.value.reduce((s, i) => s + i.price * i.quantity, 0))
  const formattedTotal = computed(() => formatPrice(total.value))
  const isEmpty = computed(() => items.value.length === 0)

  function addItem(item: Omit<CartItem, 'quantity'>): void {
    const existing = items.value.find(i => i.menuItemId === item.menuItemId)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...item, quantity: 1 })
    }
    isOpen.value = true
  }

  function removeItem(menuItemId: string): void {
    items.value = items.value.filter(i => i.menuItemId !== menuItemId)
  }

  function updateQuantity(menuItemId: string, qty: number): void {
    if (qty <= 0) { removeItem(menuItemId); return }
    const item = items.value.find(i => i.menuItemId === menuItemId)
    if (item) item.quantity = qty
  }

  function clearCart(): void {
    items.value = []
  }

  function open(): void { isOpen.value = true }
  function close(): void { isOpen.value = false }

  return {
    items, isOpen,
    count, total, formattedTotal, isEmpty,
    addItem, removeItem, updateQuantity, clearCart,
    open, close,
  }
})
