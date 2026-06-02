import type { IBranch, IBranchDraft } from '../model/types'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const MOCK: IBranch[] = [
  {
    id: 'branch-1',
    name: 'Арбат',
    address: 'ул. Арбат, д. 1, Москва',
    phone: '+7 (495) 123-45-67',
    isActive: true,
    workingHours: {
      mon: { isOpen: true,  from: '10:00', to: '23:00' },
      tue: { isOpen: true,  from: '10:00', to: '23:00' },
      wed: { isOpen: true,  from: '10:00', to: '23:00' },
      thu: { isOpen: true,  from: '10:00', to: '23:00' },
      fri: { isOpen: true,  from: '10:00', to: '00:00' },
      sat: { isOpen: true,  from: '11:00', to: '00:00' },
      sun: { isOpen: true,  from: '11:00', to: '22:00' },
    },
  },
  {
    id: 'branch-2',
    name: 'Тверская',
    address: 'ул. Тверская, д. 15, Москва',
    phone: '+7 (495) 234-56-78',
    isActive: true,
    workingHours: {
      mon: { isOpen: true,  from: '09:00', to: '22:00' },
      tue: { isOpen: true,  from: '09:00', to: '22:00' },
      wed: { isOpen: true,  from: '09:00', to: '22:00' },
      thu: { isOpen: true,  from: '09:00', to: '22:00' },
      fri: { isOpen: true,  from: '09:00', to: '23:00' },
      sat: { isOpen: true,  from: '10:00', to: '23:00' },
      sun: { isOpen: false, from: '10:00', to: '22:00' },
    },
  },
  {
    id: 'branch-3',
    name: 'Хамовники',
    address: 'Комсомольский пр., д. 42, Москва',
    phone: '+7 (495) 345-67-89',
    isActive: false,
    workingHours: {
      mon: { isOpen: true,  from: '11:00', to: '21:00' },
      tue: { isOpen: true,  from: '11:00', to: '21:00' },
      wed: { isOpen: true,  from: '11:00', to: '21:00' },
      thu: { isOpen: true,  from: '11:00', to: '21:00' },
      fri: { isOpen: true,  from: '11:00', to: '22:00' },
      sat: { isOpen: true,  from: '12:00', to: '22:00' },
      sun: { isOpen: true,  from: '12:00', to: '21:00' },
    },
  },
]

// MOCK: заменить на http.get<IBranch[]>('/admin/branches')
export async function fetchBranches(): Promise<IBranch[]> {
  await delay(400)
  return MOCK.map((b) => JSON.parse(JSON.stringify(b)))
}

// MOCK: заменить на http.post<IBranch>('/admin/branches', draft)
export async function createBranch(draft: IBranchDraft): Promise<IBranch> {
  await delay(500)
  const branch: IBranch = { id: crypto.randomUUID(), isActive: true, ...JSON.parse(JSON.stringify(draft)) }
  MOCK.push(branch)
  return JSON.parse(JSON.stringify(branch))
}

// MOCK: заменить на http.put<IBranch>(`/admin/branches/${id}`, draft)
export async function updateBranch(id: string, draft: IBranchDraft): Promise<IBranch> {
  await delay(500)
  const i = MOCK.findIndex((b) => b.id === id)
  if (i === -1) return Promise.reject({ message: 'Точка не найдена' })
  Object.assign(MOCK[i], JSON.parse(JSON.stringify(draft)))
  return JSON.parse(JSON.stringify(MOCK[i]))
}

// MOCK: заменить на http.patch(`/admin/branches/${id}/toggle`)
export async function toggleBranch(id: string): Promise<IBranch> {
  await delay(300)
  const branch = MOCK.find((b) => b.id === id)
  if (!branch) return Promise.reject({ message: 'Точка не найдена' })
  branch.isActive = !branch.isActive
  return JSON.parse(JSON.stringify(branch))
}

// MOCK: заменить на http.delete(`/admin/branches/${id}`)
export async function deleteBranch(id: string): Promise<void> {
  await delay(300)
  const i = MOCK.findIndex((b) => b.id === id)
  if (i !== -1) MOCK.splice(i, 1)
}
