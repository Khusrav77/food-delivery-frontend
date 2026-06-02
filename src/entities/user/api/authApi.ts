import { AUTH_TOKEN_KEY } from '@/shared/api'
import type {
  IUser,
  ILoginPayload,
  IRegisterPayload,
  IAuthResponse,
  IResetRequestPayload,
  IResetConfirmPayload,
  IUpdateProfilePayload,
} from '../model/types'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

// MOCK: заменить на http.post/get после реализации бэкенда auth.
// Для тестирования: любые непустые данные проходят; код сброса — «1234».

export async function loginUser(payload: ILoginPayload): Promise<IAuthResponse> {
  await delay(700)
  if (!payload.identifier.trim() || !payload.password.trim()) {
    return Promise.reject({ code: 'AUTH_INVALID', message: 'Неверный логин или пароль' })
  }
  const token = `mock-${Date.now()}`
  const user: IUser = {
    id: 'u-1',
    name: 'Алексей Смирнов',
    bonusBalance: 120,
    email: payload.identifier.includes('@') ? payload.identifier : undefined,
    phone: payload.identifier.includes('@') ? undefined : payload.identifier,
  }
  return { token, user }
}

export async function registerUser(payload: IRegisterPayload): Promise<IAuthResponse> {
  await delay(900)
  const token = `mock-${Date.now()}`
  const user: IUser = {
    id: `u-${Date.now()}`,
    name: `${payload.firstName} ${payload.lastName}`.trim(),
    bonusBalance: 0,
    email: payload.email,
    phone: payload.phone,
  }
  return { token, user }
}

export async function getMe(): Promise<IUser> {
  // MOCK: распознаёт только mock-токены (localStorage). Заменить на:
  // const res = await http.get<IUser>('/users/me'); return res.data
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (!token?.startsWith('mock-')) {
    return Promise.reject({ code: 'AUTH_EXPIRED', message: 'Сессия истекла' })
  }
  await delay(200)
  return { id: 'u-1', name: 'Алексей Смирнов', bonusBalance: 120, email: 'alex@example.com', phone: '+7 (999) 123-45-67' }
}

export async function requestPasswordReset(payload: IResetRequestPayload): Promise<void> {
  await delay(600)
  if (!payload.identifier.trim()) {
    return Promise.reject({ code: 'RESET_INVALID', message: 'Введите email или телефон' })
  }
  // Mock: sends code to identifier. Code is always '1234'.
}

export async function confirmPasswordReset(payload: IResetConfirmPayload): Promise<void> {
  await delay(700)
  if (payload.code !== '1234') {
    return Promise.reject({ code: 'RESET_WRONG_CODE', message: 'Неверный код подтверждения' })
  }
}

export async function logoutUser(): Promise<void> {
  await delay(200)
  // MOCK: POST /auth/logout — заменить на: await http.post('/auth/logout')
}

// MOCK: заменить на: const res = await http.put<IUser>('/users/me', payload); return res.data
export async function updateProfile(payload: IUpdateProfilePayload): Promise<IUser> {
  await delay(700)
  return {
    id: 'u-1',
    name: `${payload.firstName} ${payload.lastName}`.trim(),
    bonusBalance: 120,
    email: payload.email || undefined,
    phone: payload.phone || undefined,
  }
}
