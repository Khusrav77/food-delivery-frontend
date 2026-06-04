<script setup lang="ts">
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-vue-next'
import type { Component } from 'vue'
import { useToastStore, type ToastType } from '@/shared/lib/toast'

const toast = useToastStore()

const ICONS: Record<ToastType, Component> = {
  success: CheckCircle2,
  error:   XCircle,
  info:    Info,
  warning: AlertTriangle,
}

const STYLES: Record<ToastType, { wrap: string; icon: string }> = {
  success: { wrap: 'border-emerald-200 bg-surface',    icon: 'text-emerald-500' },
  error:   { wrap: 'border-red-200 bg-surface',        icon: 'text-red-500'     },
  info:    { wrap: 'border-blue-200 bg-surface',       icon: 'text-blue-500'    },
  warning: { wrap: 'border-amber-200 bg-surface',      icon: 'text-amber-500'   },
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 items-end
             max-w-[calc(100vw-2.5rem)] sm:max-w-[360px]"
      aria-live="polite"
      aria-label="Уведомления"
    >
      <TransitionGroup name="toast">
        <div
          v-for="t in toast.toasts"
          :key="t.id"
          class="flex items-start gap-3 w-full px-4 py-3.5 rounded-2xl border shadow-lg
                 shadow-ink/[0.07] cursor-default select-none"
          :class="STYLES[t.type].wrap"
          role="alert"
        >
          <component
            :is="ICONS[t.type]"
            :size="19"
            class="shrink-0 mt-0.5"
            :class="STYLES[t.type].icon"
          />
          <span class="flex-1 text-sm font-medium text-ink leading-snug">{{ t.message }}</span>
          <button
            class="shrink-0 -mr-1 w-6 h-6 flex items-center justify-center rounded-lg
                   text-faint hover:text-ink hover:bg-surface-soft transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            :aria-label="`Закрыть уведомление`"
            @click="toast.dismiss(t.id)"
          >
            <X :size="14" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.28s cubic-bezier(0.21, 1.02, 0.73, 1);
}
.toast-leave-active {
  transition: all 0.22s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(24px) scale(0.97);
}
.toast-move {
  transition: transform 0.28s ease;
}
</style>
