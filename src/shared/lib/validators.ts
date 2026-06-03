export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PHONE_RE = /^(\+7|8)[\d\s\-()]{10,}$/

export function isEmail(v: string): boolean {
  return EMAIL_RE.test(v.trim())
}

export function isPhone(v: string): boolean {
  return PHONE_RE.test(v.trim())
}

export function isIdentifier(v: string): boolean {
  return isEmail(v) || isPhone(v)
}
