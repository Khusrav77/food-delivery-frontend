import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Tag } from './types'

const mockTags: Tag[] = [
  { id: 't1', label: 'Хит', color: 'orange', emoji: '⭐' },
  { id: 't2', label: 'Новинка', color: 'green', emoji: '🆕' },
  { id: 't3', label: 'Острый', color: 'red', emoji: '🌶️' },
  { id: 't4', label: 'Вегетарианский', color: 'emerald', emoji: '🥦' },
  { id: 't5', label: 'Без глютена', color: 'violet', emoji: '🌾' },
]

export const useTagStore = defineStore('tag', () => {
  const tags = ref<Tag[]>([...mockTags])

  function addTag(tag: Omit<Tag, 'id'>) {
    tags.value.push({ ...tag, id: `t${Date.now()}` })
  }

  function removeTag(id: string) {
    tags.value = tags.value.filter(t => t.id !== id)
  }

  function getById(id: string) {
    return tags.value.find(t => t.id === id)
  }

  return { tags, addTag, removeTag, getById }
})
