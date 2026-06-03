export interface IDeliveryRecord {
  id: string
  orderNumber: string
  clientName: string
  address: string
  deliveredAt: string
  earnings: number
}

export interface IAdminCourier {
  id: string
  name: string
  phone: string
  isOnline: boolean
  activeOrdersCount: number
  totalDeliveries: number
  earnings: { week: number; month: number }
  joinedAt: string
  deliveryHistory: IDeliveryRecord[]
}

export interface ICourierDraft {
  name: string
  phone: string
}

export interface ICourierDraftErrors {
  name?: string
  phone?: string
}

export function defaultDraft(): ICourierDraft {
  return { name: '', phone: '' }
}

export function validateCourierDraft(d: ICourierDraft): ICourierDraftErrors {
  const errors: ICourierDraftErrors = {}
  if (!d.name.trim()) errors.name = 'Введите имя'
  if (!d.phone.trim()) errors.phone = 'Введите телефон'
  else if (!/^\+?[\d\s()\-]{7,20}$/.test(d.phone.trim())) errors.phone = 'Некорректный телефон'
  return errors
}
