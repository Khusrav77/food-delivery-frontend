import axios, { type AxiosError } from 'axios'

export interface ApiError {
  code: string
  message: string
  fields?: Record<string, string>
}

export const AUTH_TOKEN_KEY = 'auth_token'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (err: AxiosError<{ code?: string; message?: string; fields?: Record<string, string> }>) => {
    const apiError: ApiError = {
      code: err.response?.data?.code ?? String(err.response?.status ?? 'NETWORK_ERROR'),
      message: err.response?.data?.message ?? err.message,
      fields: err.response?.data?.fields,
    }
    return Promise.reject(apiError)
  },
)
