import type { IBonusProgramSettings } from '../model/types'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const MOCK: IBonusProgramSettings = { enabled: true, earnRatePct: 5, maxRedeemPct: 50 }

// MOCK: заменить на http.get<IBonusProgramSettings>('/admin/bonus-program')
export async function fetchBonusProgram(): Promise<IBonusProgramSettings> {
  await delay(400)
  return { ...MOCK }
}

// MOCK: заменить на http.put<IBonusProgramSettings>('/admin/bonus-program', payload)
export async function updateBonusProgram(payload: IBonusProgramSettings): Promise<IBonusProgramSettings> {
  await delay(500)
  Object.assign(MOCK, payload)
  return { ...MOCK }
}
