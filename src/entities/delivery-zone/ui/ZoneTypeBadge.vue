<script setup lang="ts">
import type { ZoneType } from '../model/types'
import { ZONE_TYPE_META } from '../model/types'

defineProps<{ type: ZoneType }>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border"
    :class="[ZONE_TYPE_META[type].textClass, ZONE_TYPE_META[type].bgClass, ZONE_TYPE_META[type].borderClass]"
  >
    <span
      class="w-1.5 h-1.5 rounded-full shrink-0"
      :style="{ backgroundColor: ZONE_TYPE_META[type].color }"
    />
    {{ ZONE_TYPE_META[type].label }}
  </span>
</template>
