import type { ThemeMode, ThemeArea } from './types'

const STORAGE_KEYS: Record<ThemeArea, string> = {
  client: 'theme:client',
  admin: 'theme:admin',
}

export function getSystemPreference(): ThemeMode {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function loadStored(area: ThemeArea): ThemeMode | null {
  const value = localStorage.getItem(STORAGE_KEYS[area])
  return value === 'dark' || value === 'light' ? value : null
}

export function persist(area: ThemeArea, mode: ThemeMode): void {
  localStorage.setItem(STORAGE_KEYS[area], mode)
}

export function applyClass(mode: ThemeMode): void {
  document.documentElement.classList.toggle('dark', mode === 'dark')
}

// Detects area from current URL to prevent FOUC before layout mounts
export function detectArea(): ThemeArea {
  return window.location.pathname.startsWith('/admin') ? 'admin' : 'client'
}
