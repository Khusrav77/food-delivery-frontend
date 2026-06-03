export interface IBonusProgramSettings {
  enabled: boolean
  earnRatePct: number   // % от суммы заказа → бонусы (0–100)
  maxRedeemPct: number  // макс. % суммы заказа, оплачиваемый бонусами (0–100)
}

export interface IBonusProgramErrors {
  earnRatePct?: string
  maxRedeemPct?: string
}