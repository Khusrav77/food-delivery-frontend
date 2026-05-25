<script setup lang="ts">
</script>

<template>
  <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-400 to-amber-400 px-8 py-8 flex items-center justify-between">
    <!-- Decorative glow -->
    <div class="absolute right-0 top-0 w-64 h-64 rounded-full bg-white opacity-10 translate-x-20 -translate-y-20 pointer-events-none" />
    <div class="absolute right-32 bottom-0 w-32 h-32 rounded-full bg-white opacity-10 translate-y-12 pointer-events-none" />

    <!-- Text content -->
    <div class="relative z-10 max-w-md">
      <p class="text-white/80 text-sm font-medium uppercase tracking-wider mb-1">Специальное предложение</p>
      <h3 class="text-2xl md:text-3xl font-bold text-white mb-2 leading-snug">
        Оформите аккаунт и получите кешбэк 20%
      </h3>
      <p class="text-white/80 text-sm md:text-base mb-5">
        С первого заказа в течение 10 дней после регистрации
      </p>
      <RouterLink
        to="/admin/dashboard"
        class="inline-block bg-white text-orange-600 font-semibold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors text-sm shadow-sm"
      >
        Зарегистрироваться
      </RouterLink>
    </div>

    <!-- Mascot -->
    <div class="hidden md:block text-7xl select-none relative z-10">🐶</div>
  </div>
</template>
