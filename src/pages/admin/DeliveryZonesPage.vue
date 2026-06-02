<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDeliveryZonesPage } from './model/useDeliveryZonesPage'
import { ZoneMap, ZoneFormModal } from '@/features/zone-editor'
import { ZoneListPanel } from '@/widgets/delivery-zones'

const page       = useDeliveryZonesPage()
const zoneMapRef = ref<InstanceType<typeof ZoneMap> | null>(null)

function onStartEditGeometry(id: string): void {
  zoneMapRef.value?.startEditing(id)
}

onMounted(page.fetchZones)
</script>

<template>
  <div class="p-6 space-y-5">
    <!-- Header -->
    <div>
      <h1 class="font-display text-xl font-extrabold text-ink">Зоны доставки</h1>
      <p class="text-xs text-faint mt-0.5">Рисуйте зоны на карте и задавайте условия доставки</p>
    </div>

    <!-- Map + panel layout -->
    <div class="flex gap-4 items-stretch">
      <div class="flex-1 min-w-0">
        <ZoneMap
          ref="zoneMapRef"
          :zones="page.zones"
          :selected-id="page.selectedId"
          @select="page.selectZone"
          @draw-finish="page.handleDrawFinish"
          @geometry-save="page.handleGeometrySave"
        />
      </div>
      <div class="w-72 shrink-0">
        <ZoneListPanel
          :zones="page.zones"
          :loading="page.loadingList"
          :error="page.listError"
          :selected-id="page.selectedId"
          @select="page.selectZone"
          @edit-params="page.handleEditParams"
          @start-edit-geometry="onStartEditGeometry"
          @delete="page.deleteZone"
        />
      </div>
    </div>

    <!-- Zone params modal -->
    <ZoneFormModal
      :visible="page.showModal"
      :zone="page.editingZone"
      :pending-polygon="page.pendingPolygon"
      :saving="page.modalSaving"
      @close="page.closeModal"
      @save="page.saveZone"
    />
  </div>
</template>
