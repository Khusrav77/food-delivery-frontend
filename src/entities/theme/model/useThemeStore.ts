import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { ThemeMode, ThemeArea } from './types'
import {
  getSystemPreference,
  loadStored,
  persist,
  applyClass,
  detectArea,
} from './themePrefs'

export const useThemeStore = defineStore('theme', () => {
  const clientTheme = ref<ThemeMode>(loadStored('client') ?? getSystemPreference())
  const adminTheme = ref<ThemeMode>(loadStored('admin') ?? getSystemPreference())
  const activeArea = ref<ThemeArea>(detectArea())

  const activeTheme = computed<ThemeMode>(() =>
    activeArea.value === 'admin' ? adminTheme.value : clientTheme.value,
  )

  function setActiveArea(area: ThemeArea): void {
    activeArea.value = area
  }

  function toggle(area: ThemeArea): void {
    if (area === 'client') {
      clientTheme.value = clientTheme.value === 'dark' ? 'light' : 'dark'
      persist('client', clientTheme.value)
    } else {
      adminTheme.value = adminTheme.value === 'dark' ? 'light' : 'dark'
      persist('admin', adminTheme.value)
    }
  }

  watch(activeTheme, (mode) => applyClass(mode), { immediate: true })

  return { clientTheme, adminTheme, activeArea, activeTheme, setActiveArea, toggle }
})
