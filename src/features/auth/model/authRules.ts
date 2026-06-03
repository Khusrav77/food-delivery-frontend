export { isEmail, isPhone, isIdentifier } from '@/shared/lib/validators'

export type FormErrors = Record<string, string>

export function validateLogin(identifier: string, password: string): FormErrors {
  const e: FormErrors = {}
  if (!identifier.trim()) e.identifier = 'Введите email или телефон'
  else if (!isIdentifier(identifier)) e.identifier = 'Неверный формат email или телефона'
  if (!password) e.password = 'Введите пароль'
  return e
}

export function validateRegister(data: {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirm: string
}): FormErrors {
  const e: FormErrors = {}
  if (!data.firstName.trim()) e.firstName = 'Введите имя'
  if (!data.lastName.trim()) e.lastName = 'Введите фамилию'
  if (!data.email.trim()) e.email = 'Введите email'
  else if (!isEmail(data.email)) e.email = 'Неверный формат email'
  if (!data.phone.trim()) e.phone = 'Введите телефон'
  else if (!isPhone(data.phone)) e.phone = 'Неверный формат телефона (+7XXXXXXXXXX)'
  if (!data.password) e.password = 'Введите пароль'
  else if (data.password.length < 8) e.password = 'Минимум 8 символов'
  if (!data.confirm) e.confirm = 'Подтвердите пароль'
  else if (data.confirm !== data.password) e.confirm = 'Пароли не совпадают'
  return e
}

export function validateResetRequest(identifier: string): FormErrors {
  const e: FormErrors = {}
  if (!identifier.trim()) e.identifier = 'Введите email или телефон'
  else if (!isIdentifier(identifier)) e.identifier = 'Неверный формат email или телефона'
  return e
}

export function validateResetConfirm(code: string, newPassword: string, confirm: string): FormErrors {
  const e: FormErrors = {}
  if (!code.trim()) e.code = 'Введите код из письма'
  if (!newPassword) e.newPassword = 'Введите новый пароль'
  else if (newPassword.length < 8) e.newPassword = 'Минимум 8 символов'
  if (!confirm) e.confirm = 'Подтвердите пароль'
  else if (confirm !== newPassword) e.confirm = 'Пароли не совпадают'
  return e
}
