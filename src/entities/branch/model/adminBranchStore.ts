import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IBranch, IBranchDraft } from './types'
import { fetchBranches, createBranch, updateBranch, toggleBranch, deleteBranch } from '../api/branchApi'

export const useAdminBranchStore = defineStore('adminBranch', () => {
  const list    = ref<IBranch[]>([])
  const loading = ref(false)
  const error   = ref<string | null>(null)

  function sync(branch: IBranch): void {
    const i = list.value.findIndex((b) => b.id === branch.id)
    if (i !== -1) list.value[i] = branch
    else list.value.push(branch)
  }

  async function fetchAll(): Promise<void> {
    loading.value = true
    error.value = null
    try { list.value = await fetchBranches() }
    catch (e) { error.value = (e as { message?: string }).message ?? 'Ошибка загрузки' }
    finally { loading.value = false }
  }

  async function create(draft: IBranchDraft): Promise<IBranch> {
    const branch = await createBranch(draft)
    sync(branch)
    return branch
  }

  async function update(id: string, draft: IBranchDraft): Promise<IBranch> {
    const branch = await updateBranch(id, draft)
    sync(branch)
    return branch
  }

  async function toggle(id: string): Promise<void> {
    const branch = await toggleBranch(id)
    sync(branch)
  }

  async function remove(id: string): Promise<void> {
    await deleteBranch(id)
    list.value = list.value.filter((b) => b.id !== id)
  }

  return { list, loading, error, fetchAll, create, update, toggle, remove }
})
