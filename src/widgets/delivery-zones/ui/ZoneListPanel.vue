<script setup lang="ts">
import { Pencil, Spline, Trash2, MapPinOff } from 'lucide-vue-next'
import { ZONE_TYPE_META } from '@/entities/delivery-zone'
import { ZoneTypeBadge } from '@/entities/delivery-zone'
import type { IDeliveryZone } from '@/entities/delivery-zone'
import { formatPrice } from '@/shared/lib/money'

defineProps<{
  zones: IDeliveryZone[]
  loading: boolean
  error: string | null
  selectedId: string | null
}>()

const emit = defineEmits<{
  select: [id: string | null]
  'edit-params': [id: string]
  'start-edit-geometry': [id: string]
  delete: [id: string]
}>()
</script>

<template>
  <div class="flex flex-col bg-surface border border-line rounded-2xl overflow-hidden shadow-sm" style="min-height: 540px;">
    <!-- Panel header -->
    <div class="px-4 py-3.5 border-b border-line shrink-0">
      <h2 class="font-semibold text-sm text-ink">Зоны доставки</h2>
      <p class="text-xs text-faint mt-0.5">{{ zones.length }} зон{{ zones.length === 1 ? 'а' : zones.length < 5 ? 'ы' : '' }}</p>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="p-3 space-y-2">
      <div
        v-for="i in 4"
        :key="i"
        class="h-16 rounded-xl bg-canvas animate-pulse"
      />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex-1 flex flex-col items-center justify-center gap-2 p-6 text-center">
      <p class="text-sm text-red-500">{{ error }}</p>
    </div>

    <!-- Empty -->
    <div v-else-if="zones.length === 0" class="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
      <div class="w-12 h-12 rounded-2xl bg-canvas border border-line flex items-center justify-center">
        <MapPinOff :size="22" class="text-faint" />
      </div>
      <div>
        <p class="text-sm font-medium text-ink">Нет зон доставки</p>
        <p class="text-xs text-faint mt-1">Нарисуйте первую зону на карте кнопкой «Нарисовать зону»</p>
      </div>
    </div>

    <!-- Zone list -->
    <ul v-else class="flex-1 overflow-y-auto divide-y divide-line">
      <li
        v-for="zone in zones"
        :key="zone.id"
        class="group px-4 py-3 transition-colors cursor-pointer"
        :class="selectedId === zone.id ? 'bg-accent-soft' : 'hover:bg-surface-soft'"
        @click="emit('select', zone.id)"
      >
        <div class="flex items-start gap-3">
          <!-- Color indicator -->
          <div
            class="mt-0.5 w-3 h-3 rounded-full shrink-0 border-2 border-white shadow-sm"
            :style="{ backgroundColor: ZONE_TYPE_META[zone.type].color }"
          />

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span
                class="text-sm font-semibold truncate"
                :class="selectedId === zone.id ? 'text-accent' : 'text-ink'"
              >
                {{ zone.name }}
              </span>
              <ZoneTypeBadge :type="zone.type" />
            </div>
            <div
              v-if="zone.type === 'paid'"
              class="mt-1 text-xs text-muted space-x-2"
            >
              <span>{{ formatPrice(zone.deliveryCost ?? 0) }}</span>
              <span class="text-faint">·</span>
              <span>от {{ formatPrice(zone.minOrderAmount ?? 0) }}</span>
            </div>
            <div v-else-if="zone.type === 'none'" class="mt-1 text-xs text-red-400">
              Заказы не принимаются
            </div>
            <div v-else class="mt-1 text-xs text-emerald-600">
              Бесплатная доставка
            </div>
          </div>

          <!-- Actions -->
          <div
            class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            :class="selectedId === zone.id ? 'opacity-100' : ''"
            @click.stop
          >
            <!-- Edit params -->
            <button
              class="p-1.5 rounded-lg text-faint hover:text-ink hover:bg-surface transition-colors
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              title="Редактировать параметры"
              @click="emit('edit-params', zone.id)"
            >
              <Pencil :size="13" />
            </button>
            <!-- Edit geometry -->
            <button
              class="p-1.5 rounded-lg text-faint hover:text-indigo-600 hover:bg-indigo-50 transition-colors
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40"
              title="Изменить контур"
              @click="emit('start-edit-geometry', zone.id)"
            >
              <Spline :size="13" />
            </button>
            <!-- Delete -->
            <button
              class="p-1.5 rounded-lg text-faint hover:text-red-500 hover:bg-red-50 transition-colors
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40"
              title="Удалить зону"
              @click="emit('delete', zone.id)"
            >
              <Trash2 :size="13" />
            </button>
          </div>
        </div>
      </li>
    </ul>

    <!-- Legend footer -->
    <div class="px-4 py-3 border-t border-line bg-canvas shrink-0">
      <div class="flex flex-col gap-1.5">
        <div v-for="(meta, type) in ZONE_TYPE_META" :key="type" class="flex items-center gap-2 text-xs text-muted">
          <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: meta.color }" />
          {{ meta.label }}
        </div>
      </div>
    </div>
  </div>
</template>
