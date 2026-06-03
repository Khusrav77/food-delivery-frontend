import type { IReferralInfo } from '../model/types'

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const REFERRAL_DB: IReferralInfo = {
  code: 'ALEX2024',
  link: 'https://foodhub.ru/r/ALEX2024',
  totalInvited: 3,
  totalBonusEarned: 450,
  referrals: [
    { id: 'ref-1', name: 'Мария К.', joinedAt: '2026-05-12T10:30:00Z', bonusEarned: 150 },
    { id: 'ref-2', name: 'Дмитрий П.', joinedAt: '2026-05-20T15:45:00Z', bonusEarned: 150 },
    { id: 'ref-3', name: 'Ольга С.', joinedAt: '2026-05-28T09:10:00Z', bonusEarned: 150 },
  ],
}

// MOCK: GET /referral — заменить на http.get<IReferralInfo>('/referral')
export async function fetchReferralInfo(): Promise<IReferralInfo> {
  await delay(300)
  return {
    ...REFERRAL_DB,
    referrals: REFERRAL_DB.referrals.map((r) => ({ ...r })),
  }
}
