<script setup lang="ts">
import { Store } from 'lucide-vue-next'
import { UnderConstruction } from '@/shared/ui/UnderConstruction'
</script>

<template>
  <UnderConstruction title="Рестораны">
    <Store :size="28" class="text-orange-400" />
  </UnderConstruction>
</template>
