import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { IBranch } from './types'
import { fetchBranches } from '../api/branchApi'

export const useBranchStore = defineStore('branch', () => {
  const list = ref<IBranch[]>([])
  const loading = ref(false)

  const activeBranches = computed(() => list.value.filter((b) => b.isActive))

  function getById(id: string): IBranch | undefined {
    return list.value.find((b) => b.id === id)
  }

  async function fetchAll(): Promise<void> {
    if (list.value.length) return
    loading.value = true
    try { list.value = await fetchBranches() }
    finally { loading.value = false }
  }

  return { list, loading, activeBranches, getById, fetchAll }
})
