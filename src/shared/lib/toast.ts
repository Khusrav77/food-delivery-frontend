import { ref } from 'vue'
import { defineStore } from 'pinia'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration: number // ms; 0 = persistent
}

const DEFAULT_DURATION = 3500

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  function add(type: ToastType, message: string, duration = DEFAULT_DURATION): void {
    const id = crypto.randomUUID()
    toasts.value.push({ id, type, message, duration })
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration)
    }
  }

  function dismiss(id: string): void {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  const success = (message: string, duration?: number) => add('success', message, duration)
  const error   = (message: string, duration?: number) => add('error',   message, duration)
  const info    = (message: string, duration?: number) => add('info',    message, duration)
  const warning = (message: string, duration?: number) => add('warning', message, duration)

  return { toasts, add, dismiss, success, error, info, warning }
})
