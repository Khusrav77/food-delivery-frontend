export type AnalyticsPeriod = 'today' | 'week' | 'month'

export interface IDailyPoint {
  label: string   // 'Пн', '12 мая', etc.
  orders: number
  revenue: number
}

export interface IOrdersStats {
  total: number
  revenue: number
  avgCheck: number
  cancelled: number
  daily: IDailyPoint[]
}

export interface IBonusStats {
  earned: number
  spent: number
  transactions: number
}

export interface IPromoStat {
  code: string
  type: 'percent' | 'fixed'
  value: number
  usages: number
  discount: number
}

export interface IPromoStats {
  totalUsages: number
  totalDiscount: number
  byCodes: IPromoStat[]
}

export interface ITopDish {
  name: string
  count: number
  revenue: number
}

export interface IAnalyticsReport {
  period: AnalyticsPeriod
  orders: IOrdersStats
  bonuses: IBonusStats
  promos: IPromoStats
  topDishes: ITopDish[]
}
