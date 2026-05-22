import { http } from '@/shared/api'
import type { Category } from '../model/types'

type CategoryPayload = { name: string; imageUrl?: string | null; position?: number }

export async function fetchCategories(): Promise<Category[]> {
  const res = await http.get<Category[]>('/categories')
  return res.data
}

export async function createCategory(payload: { name: string }): Promise<Category> {
  const res = await http.post<Category>('/categories', payload)
  return res.data
}

export async function updateCategory(
  id: string,
  payload: CategoryPayload,
): Promise<Category> {
  const res = await http.put<Category>(`/categories/${id}`, payload)
  return res.data
}

export async function deleteCategory(id: string): Promise<void> {
  await http.delete(`/categories/${id}`)
}
