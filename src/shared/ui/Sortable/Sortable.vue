<script setup lang="ts" generic="T extends { id: string }">
import draggable from 'vuedraggable'

const model = defineModel<T[]>({ required: true })

defineProps<{
  disabled?: boolean
  /** CSS selector of the drag handle inside each item; omit to drag by the whole item. */
  handle?: string
}>()

const emit = defineEmits<{ end: [] }>()

defineSlots<{ item(props: { element: T }): unknown }>()
</script>

<template>
  <draggable
    v-model="model"
    item-key="id"
    :disabled="disabled"
    :handle="handle"
    :animation="180"
    :delay="150"
    :delay-on-touch-only="false"
    :force-fallback="true"
    ghost-class="opacity-40"
    fallback-class="opacity-60 shadow-lg"
    @end="emit('end')"
  >
    <template #item="{ element }">
      <slot name="item" :element="(element as T)" />
    </template>
  </draggable>
</template>
