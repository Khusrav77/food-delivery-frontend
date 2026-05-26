import { ref } from 'vue'
import { useTagStore } from '@/entities/tag'
import type { TagColor } from '@/entities/tag'

export const COLOR_OPTIONS: { value: TagColor; label: string; cls: string }[] = [
  { value: 'red', label: 'Красный', cls: 'bg-red-500' },
  { value: 'orange', label: 'Оранжевый', cls: 'bg-orange-500' },
  { value: 'green', label: 'Зелёный', cls: 'bg-green-500' },
  { value: 'emerald', label: 'Изумрудный', cls: 'bg-emerald-500' },
  { value: 'blue', label: 'Синий', cls: 'bg-blue-500' },
  { value: 'violet', label: 'Фиолетовый', cls: 'bg-violet-500' },
  { value: 'yellow', label: 'Жёлтый', cls: 'bg-yellow-500' },
]

export function useTagManager() {
  const tagStore = useTagStore()

  const newLabel = ref('')
  const newEmoji = ref('')
  const newColor = ref<TagColor>('orange')

  async function addTag() {
    if (!newLabel.value.trim()) return
    await tagStore.addTag({
      label: newLabel.value.trim(),
      color: newColor.value,
      emoji: newEmoji.value || undefined,
    })
    newLabel.value = ''
    newEmoji.value = ''
    newColor.value = 'orange'
  }

  return {
    tagStore,
    newLabel,
    newEmoji,
    newColor,
    colorOptions: COLOR_OPTIONS,
    addTag,
  }
}