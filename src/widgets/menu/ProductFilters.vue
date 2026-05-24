<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { useTagStore, TagBadge } from '@/entities/tag'

const props = defineProps<{ search: string; activeTagIds: string[] }>()
const emit = defineEmits<{
  'update:search': [value: string]
  'update:activeTagIds': [ids: string[]]
}>()

const tagStore = useTagStore()

function toggleTag(id: string) {
  const ids = [...props.activeTagIds]
  const idx = ids.indexOf(id)
  if (idx === -1) ids.push(id)
  else ids.splice(idx, 1)
  emit('update:activeTagIds', ids)
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <div class="relative">
      <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        :value="search"
        type="text"
        placeholder="Поиск..."
        class="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-52"
        @input="emit('update:search', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="tag in tagStore.tags"
        :key="tag.id"
        type="button"
        class="transition-all"
        :class="activeTagIds.includes(tag.id) ? 'ring-2 ring-orange-400 ring-offset-1 rounded-full' : 'opacity-60 hover:opacity-100'"
        @click="toggleTag(tag.id)"
      >
        <TagBadge :tag="tag" />
      </button>
    </div>
  </div>
</template>