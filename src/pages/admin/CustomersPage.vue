<script setup lang="ts">
import { Users } from 'lucide-vue-next'
import { UnderConstruction } from '@/shared/ui/UnderConstruction'
</script>

<template>
  <UnderConstruction title="Клиенты">
    <Users :size="28" class="text-orange-400" />
  </UnderConstruction>
</template>
