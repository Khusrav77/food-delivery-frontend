export type BonusTransactionType = 'earn' | 'spend'

export interface IBonusTransaction {
  id: string
  type: BonusTransactionType
  amount: number
  description: string
  orderNumber?: string
  createdAt: string
}
