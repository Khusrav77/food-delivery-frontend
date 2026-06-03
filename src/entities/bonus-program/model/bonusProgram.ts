import type { IBonusProgramSettings, IBonusProgramErrors } from './types'

export function defaultSettings(): IBonusProgramSettings {
  return { enabled: true, earnRatePct: 5, maxRedeemPct: 50 }
}

export function validate(s: IBonusProgramSettings): IBonusProgramErrors {
  const errors: IBonusProgramErrors = {}
  if (!Number.isFinite(s.earnRatePct) || s.earnRatePct < 0 || s.earnRatePct > 100) {
    errors.earnRatePct = 'Укажите значение от 0 до 100'
  }
  if (!Number.isFinite(s.maxRedeemPct) || s.maxRedeemPct < 0 || s.maxRedeemPct > 100) {
    errors.maxRedeemPct = 'Укажите значение от 0 до 100'
  }
  return errors
}
