export type AdminBonusTxType = 'earn' | 'spend' | 'manual_add' | 'manual_deduct'

export interface IAdminBonusTransaction {
  id: string
  type: AdminBonusTxType
  amount: number
  comment: string
  orderNumber?: string
  createdAt: string
}

export interface IAdminCustomer {
  id: string
  name: string
  phone: string
  email: string
  ordersCount: number
  totalSpent: number
  bonusBalance: number
  registeredAt: string
  bonusHistory: IAdminBonusTransaction[]
}

export interface IBonusAdjustment {
  type: 'add' | 'deduct'
  amount: number
  comment: string
}

export const BONUS_TX_LABEL: Record<AdminBonusTxType, string> = {
  earn:         'Начислено за заказ',
  spend:        'Списано при оплате',
  manual_add:   'Ручное начисление',
  manual_deduct:'Ручное списание',
}
