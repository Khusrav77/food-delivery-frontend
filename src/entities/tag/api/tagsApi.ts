import { http } from '@/shared/api'
import type { Tag } from '../model/types'

// Backend: TagRequest.tagName, TagResponse.name
type BackendTagResponse = { id: string; name: string }

function mapTag(raw: BackendTagResponse): Pick<Tag, 'id' | 'label'> {
  return { id: raw.id, label: raw.name }
}

export async function fetchTags(): Promise<Pick<Tag, 'id' | 'label'>[]> {
  const res = await http.get<BackendTagResponse[]>('/tags')
  return res.data.map(mapTag)
}

export async function createTag(payload: { label: string }): Promise<Pick<Tag, 'id' | 'label'>> {
  const res = await http.post<BackendTagResponse>('/tags', { tagName: payload.label })
  return mapTag(res.data)
}

export async function deleteTag(id: string): Promise<void> {
  await http.delete(`/tags/${id}`)
}
