<script setup lang="ts">
import { Plus, Trash2 } from 'lucide-vue-next'
import type { DishVariant } from '../../../entities/dish'

const variants = defineModel<DishVariant[]>({ required: true })

function addVariant() {
  variants.value.push({
    id: `v${Date.now()}`,
    label: '',
    weight: undefined,
    price: 0,
    isDefault: variants.value.length === 0,
  })
}

function removeVariant(id: string) {
  if (variants.value.length <= 1) return
  const wasDefault = variants.value.find(v => v.id === id)?.isDefault
  variants.value = variants.value.filter(v => v.id !== id)
  if (wasDefault && variants.value.length > 0) variants.value[0].isDefault = true
}

function setDefault(id: string) {
  variants.value.forEach(v => (v.isDefault = v.id === id))
}
</script>

<template>
  <div class="space-y-2">
    <div class="grid grid-cols-[1fr_80px_90px_auto_auto] gap-2 text-xs text-slate-500 font-medium px-1">
      <span>Название *</span>
      <span>Вес (г)</span>
      <span>Цена (₽) *</span>
      <span class="text-center">По умолч.</span>
      <span></span>
    </div>

    <div
      v-for="v in variants"
      :key="v.id"
      class="grid grid-cols-[1fr_80px_90px_auto_auto] gap-2 items-center"
    >
      <input
        v-model="v.label"
        type="text"
        placeholder="4 шт / 20 см"
        class="border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      <input
        v-model.number="v.weight"
        type="number"
        min="0"
        placeholder="200"
        class="border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      <input
        v-model.number="v.price"
        type="number"
        min="0"
        placeholder="400"
        class="border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      <div class="flex justify-center">
        <input
          type="radio"
          :checked="v.isDefault"
          class="accent-orange-500"
          @change="setDefault(v.id)"
        />
      </div>
      <button
        type="button"
        :disabled="variants.length <= 1"
        class="p-1 text-slate-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        @click="removeVariant(v.id)"
      >
        <Trash2 :size="14" />
      </button>
    </div>

    <button
      type="button"
      class="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-sm font-medium mt-1"
      @click="addVariant"
    >
      <Plus :size="14" />
      Добавить вариант
    </button>
  </div>
</template>
