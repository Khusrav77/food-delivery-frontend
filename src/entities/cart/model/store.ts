import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { formatPrice } from '@/shared/lib/money'

export const useCartStore = defineStore('cart', () => {
  const count = ref(3)
  const totalSum = ref(1580)

  const formattedTotal = computed(() => formatPrice(totalSum.value))

  return { count, totalSum, formattedTotal }
})
