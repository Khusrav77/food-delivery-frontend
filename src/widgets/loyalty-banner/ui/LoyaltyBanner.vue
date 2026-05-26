<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Gift } from 'lucide-vue-next'
</script>

<template>
  <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-400 via-accent to-amber-600 px-8 py-10 flex items-center justify-between">
    <!-- Decorative blobs -->
    <div class="absolute right-0 top-0 w-72 h-72 rounded-full bg-white opacity-10 blur-3xl translate-x-24 -translate-y-24 pointer-events-none" />
    <div class="absolute right-40 bottom-0 w-40 h-40 rounded-full bg-white opacity-5 blur-2xl translate-y-12 pointer-events-none" />

    <!-- Text content -->
    <div class="relative z-10 max-w-md">
      <p class="text-white/75 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Специальное предложение</p>
      <h3 class="font-display text-3xl md:text-4xl font-extrabold text-white mb-3 leading-[1.1]">
        Оформите аккаунт и получите кешбэк 20%
      </h3>
      <p class="text-white/70 text-sm md:text-base mb-6">
        С первого заказа в течение 10 дней после регистрации
      </p>
      <RouterLink
        to="/admin/dashboard"
        class="inline-block bg-surface text-ink font-bold px-6 py-3 rounded-lg hover:bg-surface-soft transition-colors text-sm shadow-sm"
      >
        Зарегистрироваться
      </RouterLink>
    </div>

    <!-- Decorative icon -->
    <div class="hidden md:flex relative z-10 items-center justify-center w-28 h-28 rounded-full bg-white/15 shrink-0">
      <Gift :size="52" class="text-white" />
    </div>
  </div>
</template>
