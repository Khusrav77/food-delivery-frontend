export interface IReferral {
  id: string
  name: string
  joinedAt: string
  bonusEarned: number
}

export interface IReferralInfo {
  code: string
  link: string
  totalInvited: number
  totalBonusEarned: number
  referrals: IReferral[]
}
