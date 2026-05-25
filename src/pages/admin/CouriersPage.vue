<script setup lang="ts">
import { Bike } from 'lucide-vue-next'
import { UnderConstruction } from '@/shared/ui/UnderConstruction'
</script>

<template>
  <UnderConstruction title="Курьеры">
    <Bike :size="28" class="text-accent" />
  </UnderConstruction>
</template>
