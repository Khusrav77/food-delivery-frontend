<script setup lang="ts">
import { ShoppingBag } from 'lucide-vue-next'
import { UnderConstruction } from '@/shared/ui/UnderConstruction'
</script>

<template>
  <UnderConstruction title="Заказы">
    <ShoppingBag :size="28" class="text-accent" />
  </UnderConstruction>
</template>
