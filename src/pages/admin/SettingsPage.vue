<script setup lang="ts">
import { Settings } from 'lucide-vue-next'
import { UnderConstruction } from '@/shared/ui/UnderConstruction'
</script>

<template>
  <UnderConstruction title="Настройки">
    <Settings :size="28" class="text-accent" />
  </UnderConstruction>
</template>
