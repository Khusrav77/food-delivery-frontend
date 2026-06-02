import { ref, computed, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useOrderStore } from '@/entities/order'
import { useToastStore } from '@/shared/lib/toast'
import { PROGRESS_INTERVAL_MS } from '../config/tracking'
import { canCancel, isFinished } from './trackingRules'

interface TrackingOptions {
  onDelivered?: () => void
}

export function useOrderTracking(orderId: string, options: TrackingOptions = {}) {
  const store = useOrderStore()
  const toast = useToastStore()
  const { current: order, loadingCurrent: loading } = storeToRefs(store)

  const error = ref<string | null>(null)
  const cancelling = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null

  const cancellable = computed(() => !!order.value && canCancel(order.value.status))

  function stopTimer(): void {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function notifyIfDeliverable(): void {
    if (order.value?.status === 'delivered' && !order.value.rating) options.onDelivered?.()
  }

  async function tick(): Promise<void> {
    const updated = await store.advanceCurrent()
    if (updated && isFinished(updated.status)) {
      stopTimer()
      notifyIfDeliverable()
    }
  }

  function startProgress(): void {
    stopTimer()
    if (order.value && isFinished(order.value.status)) {
      notifyIfDeliverable()
      return
    }
    timer = setInterval(tick, PROGRESS_INTERVAL_MS)
  }

  async function load(): Promise<void> {
    error.value = null
    try {
      await store.fetchOne(orderId)
      startProgress()
    } catch (e) {
      error.value = (e as { message?: string }).message ?? 'Заказ не найден'
    }
  }

  async function cancel(): Promise<void> {
    if (!order.value) return
    cancelling.value = true
    try {
      await store.cancel(order.value.id)
      stopTimer()
      toast.info('Заказ отменён')
    } catch {
      toast.error('Не удалось отменить заказ')
    } finally {
      cancelling.value = false
    }
  }

  onUnmounted(stopTimer)

  return { order, loading, error, cancellable, cancelling, load, cancel }
}
