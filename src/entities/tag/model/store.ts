import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Tag } from './types'

const mockTags: Tag[] = [
  { id: 't1', name: 'Хит', color: 'orange', emoji: '⭐' },
  { id: 't2', name: 'Новинка', color: 'green', emoji: '🆕' },
  { id: 't3', name: 'Острый', color: 'red', emoji: '🌶️' },
  { id: 't4', name: 'Вегетарианский', color: 'emerald', emoji: '🥦' },
  { id: 't5', name: 'Без глютена', color: 'violet', emoji: '🌾' },
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
