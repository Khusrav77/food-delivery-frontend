import type { IAnalyticsReport, AnalyticsPeriod } from '../model/types'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const DAY_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

function todayReport(): IAnalyticsReport {
  const hours = [9,10,11,12,13,14,15,16,17,18,19,20,21,22]
  return {
    period: 'today',
    orders: {
      total: 18, revenue: 38400, avgCheck: 2133, cancelled: 2,
      daily: hours.map((h) => ({
        label: `${h}:00`,
        orders: Math.round(Math.random() * 3 + (h >= 12 && h <= 20 ? 2 : 0)),
        revenue: Math.round((Math.random() * 4000 + 1500) * (h >= 12 && h <= 20 ? 1.5 : 0.7)),
      })),
    },
    bonuses: { earned: 1920, spent: 350, transactions: 14 },
    promos: {
      totalUsages: 5, totalDiscount: 1200,
      byCodes: [
        { code: 'WELCOME',  type: 'percent', value: 10, usages: 3, discount: 780 },
        { code: 'FIX200',   type: 'fixed',   value: 200, usages: 2, discount: 400 },
        { code: 'SUMMER25', type: 'percent', value: 25, usages: 0, discount: 0 },
      ],
    },
    topDishes: [
      { name: 'Маргарита', count: 5, revenue: 4950 },
      { name: 'Карбонара', count: 4, revenue: 3100 },
      { name: 'Пепперони', count: 3, revenue: 3270 },
      { name: 'Цезарь', count: 3, revenue: 1350 },
      { name: 'Борщ', count: 3, revenue: 1140 },
    ],
  }
}

function weekReport(): IAnalyticsReport {
  const now = new Date()
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() - 6 + i)
    return DAY_SHORT[d.getDay()]
  })
  return {
    period: 'week',
    orders: {
      total: 156, revenue: 312800, avgCheck: 2005, cancelled: 11,
      daily: days.map((label, i) => ({
        label,
        orders: [18, 22, 17, 25, 28, 32, 14][i],
        revenue: [36200, 44100, 34000, 50000, 56200, 64100, 28200][i],
      })),
    },
    bonuses: { earned: 15640, spent: 4200, transactions: 98 },
    promos: {
      totalUsages: 34, totalDiscount: 9800,
      byCodes: [
        { code: 'WELCOME',  type: 'percent', value: 10, usages: 18, discount: 5040 },
        { code: 'FIX200',   type: 'fixed',   value: 200, usages: 10, discount: 2000 },
        { code: 'SUMMER25', type: 'percent', value: 25, usages: 6, discount: 2760 },
      ],
    },
    topDishes: [
      { name: 'Маргарита',  count: 42, revenue: 41580 },
      { name: 'Пепперони',  count: 35, revenue: 38150 },
      { name: 'Карбонара',  count: 29, revenue: 22330 },
      { name: 'Цезарь',     count: 24, revenue: 10800 },
      { name: 'Борщ',       count: 21, revenue: 7980 },
      { name: 'Стейк',      count: 18, revenue: 28800 },
      { name: 'Тирамису',   count: 16, revenue: 5120 },
      { name: 'Лимонад',    count: 15, revenue: 2700 },
    ],
  }
}

function monthReport(): IAnalyticsReport {
  const now = new Date()
  const weeks = Array.from({ length: 4 }, (_, i) => {
    const from = new Date(now)
    from.setDate(now.getDate() - 27 + i * 7)
    return `${from.getDate()} ${from.toLocaleString('ru', { month: 'short' })}`
  })
  return {
    period: 'month',
    orders: {
      total: 612, revenue: 1248600, avgCheck: 2040, cancelled: 43,
      daily: weeks.map((label, i) => ({
        label,
        orders: [128, 145, 162, 177][i],
        revenue: [261000, 296000, 330800, 360800][i],
      })),
    },
    bonuses: { earned: 62430, spent: 18700, transactions: 398 },
    promos: {
      totalUsages: 147, totalDiscount: 41200,
      byCodes: [
        { code: 'WELCOME',  type: 'percent', value: 10, usages: 47, discount: 13160 },
        { code: 'FIX200',   type: 'fixed',   value: 200, usages: 23, discount: 4600 },
        { code: 'SUMMER25', type: 'percent', value: 25, usages: 12, discount: 5760 },
        { code: 'FIX500',   type: 'fixed',   value: 500, usages: 30, discount: 15000 },
        { code: 'VIP15',    type: 'percent', value: 15, usages: 8,  discount: 2760 },
        { code: 'BLACKFRI', type: 'percent', value: 30, usages: 27, discount: 13500 },
      ],
    },
    topDishes: [
      { name: 'Маргарита',  count: 168, revenue: 166320 },
      { name: 'Пепперони',  count: 142, revenue: 154780 },
      { name: 'Карбонара',  count: 118, revenue: 90860 },
      { name: 'Стейк',      count: 96,  revenue: 153600 },
      { name: 'Цезарь',     count: 94,  revenue: 42300 },
      { name: 'Борщ',       count: 87,  revenue: 33060 },
      { name: 'Тирамису',   count: 72,  revenue: 23040 },
      { name: 'Лимонад',    count: 68,  revenue: 12240 },
      { name: 'Кола',        count: 65,  revenue: 7800 },
      { name: 'Тирамису',   count: 61,  revenue: 19520 },
    ],
  }
}

const REPORTS: Record<AnalyticsPeriod, () => IAnalyticsReport> = {
  today: todayReport,
  week:  weekReport,
  month: monthReport,
}

// MOCK: заменить на http.get<IAnalyticsReport>(`/admin/analytics?period=${period}`)
export async function fetchAnalytics(period: AnalyticsPeriod): Promise<IAnalyticsReport> {
  await delay(400)
  return REPORTS[period]()
}
