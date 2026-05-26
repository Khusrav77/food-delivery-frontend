import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Tag } from './types'
import { fetchTags, createTag, deleteTag as apiDeleteTag } from '../api/tagsApi'

export const useTagStore = defineStore('tag', () => {
  const tags = ref<Tag[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      // color/emoji — UI-only, не хранятся в БД
      tags.value = await fetchTags()
    } catch (e) {
      error.value = (e as { message: string }).message ?? 'Ошибка загрузки тегов'
    } finally {
      loading.value = false
    }
  }

  async function addTag(tag: Omit<Tag, 'id'>) {
    const created = await createTag({ label: tag.label })
    tags.value.push({ ...created, color: tag.color, emoji: tag.emoji })
  }

  async function removeTag(id: string) {
    await apiDeleteTag(id)
    tags.value = tags.value.filter(t => t.id !== id)
  }

  function getById(id: string) {
    return tags.value.find(t => t.id === id)
  }

  return { tags, loading, error, fetchAll, addTag, removeTag, getById }
})
