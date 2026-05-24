<script setup lang="ts">
import { BarChart3 } from 'lucide-vue-next'
import { UnderConstruction } from '@/shared/ui/UnderConstruction'
</script>

<template>
  <UnderConstruction title="Аналитика">
    <BarChart3 :size="28" class="text-orange-400" />
  </UnderConstruction>
</template>
