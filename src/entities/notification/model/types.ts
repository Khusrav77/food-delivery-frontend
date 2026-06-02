export type NotificationType = 'order' | 'bonus' | 'promo'

export interface INotification {
  id: string
  type: NotificationType
  title: string
  body: string
  createdAt: string
  isRead: boolean
  orderId?: string
}
