export interface IUser {
  id: string
  name: string
  bonusBalance: number
  email?: string
  phone?: string
}

export interface ILoginPayload {
  identifier: string // email or phone
  password: string
}

export interface IRegisterPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}

export interface IAuthResponse {
  token: string
  user: IUser
}

export interface IResetRequestPayload {
  identifier: string
}

export interface IResetConfirmPayload {
  identifier: string
  code: string
  newPassword: string
}

export interface IUpdateProfilePayload {
  firstName: string
  lastName: string
  email: string
  phone: string
}
