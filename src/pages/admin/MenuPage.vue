<script setup lang="ts">
import { UtensilsCrossed, Construction } from 'lucide-vue-next'
</script>

<template>
  <div class="p-6">
    <div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div class="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
        <UtensilsCrossed :size="28" class="text-orange-400" />
      </div>
      <h1 class="text-xl font-bold text-slate-800 mb-2">Меню</h1>
      <div class="flex items-center gap-2 text-slate-400 text-sm">
        <Construction :size="14" />
        <span>Модуль в разработке — следующая фаза</span>
      </div>
    </div>
  </div>
</template>
