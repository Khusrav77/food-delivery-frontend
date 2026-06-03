<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { PenLine, Check, X, Undo2, Save } from 'lucide-vue-next'
import { useZoneMap } from '../model/useZoneMap'
import type { IDeliveryZone, IGeoPoint } from '@/entities/delivery-zone'

import 'leaflet/dist/leaflet.css'

const props = defineProps<{
  zones: IDeliveryZone[]
  selectedId: string | null
}>()

const emit = defineEmits<{
  select: [id: string | null]
  'draw-finish': [points: IGeoPoint[]]
  'geometry-save': [id: string, points: IGeoPoint[]]
}>()

const mapContainer = ref<HTMLElement | null>(null)

const zoneMap = useZoneMap(
  mapContainer,
  () => props.zones,
  () => props.selectedId,
  {
    onSelect:       (id) => emit('select', id),
    onDrawFinish:   (pts) => emit('draw-finish', pts),
    onGeometrySave: (id, pts) => emit('geometry-save', id, pts),
  },
)

const { mode, drawingPoints } = zoneMap

const canFinish = computed(() => drawingPoints.value.length >= 3)

onMounted(zoneMap.initMap)

defineExpose({
  startEditing:  zoneMap.startEditing,
  cancelEditing: zoneMap.cancelEditing,
})
</script>

<template>
  <div class="relative rounded-2xl overflow-hidden border border-line shadow-sm bg-surface-soft min-h-[540px]">
    <!-- Map container -->
    <div ref="mapContainer" class="w-full h-full min-h-[540px]" />

    <!-- Toolbar overlay -->
    <div class="absolute top-3 left-3 z-[1000] flex flex-col gap-1.5">

      <!-- Idle: draw button -->
      <template v-if="mode === 'idle'">
        <button
          class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-line shadow-md
                 text-sm font-semibold text-ink hover:bg-surface-soft transition-colors
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          @click="zoneMap.startDrawing"
        >
          <PenLine :size="15" class="text-accent" />
          Нарисовать зону
        </button>
      </template>

      <!-- Drawing mode toolbar -->
      <template v-else-if="mode === 'drawing'">
        <div class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface border border-line shadow-md text-xs text-muted">
          <span class="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Кликайте на карте для добавления вершин
          <span class="ml-1 font-semibold text-ink">{{ drawingPoints.length }}</span>
        </div>
        <div class="flex gap-1.5">
          <button
            :disabled="drawingPoints.length === 0"
            class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface border border-line shadow-sm
                   text-sm font-medium text-muted hover:text-ink hover:border-ink/20 transition-colors
                   disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            @click="zoneMap.undoLastPoint"
          >
            <Undo2 :size="14" />
            Отменить
          </button>
          <button
            :disabled="!canFinish"
            class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent text-white shadow-sm
                   text-sm font-semibold hover:bg-accent-hover transition-colors
                   disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            @click="zoneMap.finishDrawing"
          >
            <Check :size="14" />
            Готово
          </button>
          <button
            class="flex items-center justify-center w-9 h-9 rounded-xl bg-surface border border-line shadow-sm
                   text-faint hover:text-red-500 hover:border-red-200 transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40"
            @click="zoneMap.cancelDrawing"
          >
            <X :size="15" />
          </button>
        </div>
      </template>

      <!-- Editing mode toolbar -->
      <template v-else-if="mode === 'editing'">
        <div class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-200 shadow-md text-xs text-indigo-700">
          <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Перетаскивайте вершины полигона
        </div>
        <div class="flex gap-1.5">
          <button
            class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent text-white shadow-sm
                   text-sm font-semibold hover:bg-accent-hover transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            @click="zoneMap.saveEditing"
          >
            <Save :size="14" />
            Сохранить контур
          </button>
          <button
            class="flex items-center justify-center w-9 h-9 rounded-xl bg-surface border border-line shadow-sm
                   text-faint hover:text-red-500 hover:border-red-200 transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40"
            @click="zoneMap.cancelEditing"
          >
            <X :size="15" />
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
