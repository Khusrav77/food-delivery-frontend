import type { Component } from 'vue'
import { Send, Instagram, Facebook, Youtube } from 'lucide-vue-next'

export interface IFooterLink {
  label: string
  href: string
}

export interface IFooterColumn {
  title: string
  links: IFooterLink[]
}

export interface IFooterSocial {
  label: string
  href: string
  icon: Component
}

export const FOOTER_COLUMNS: IFooterColumn[] = [
  {
    title: 'Компания',
    links: [
      { label: 'О нас', href: '#' },
      { label: 'Рестораны-партнёры', href: '#' },
      { label: 'Стать курьером', href: '#' },
      { label: 'Вакансии', href: '#' },
      { label: 'Блог', href: '#' },
    ],
  },
  {
    title: 'Помощь',
    links: [
      { label: 'Частые вопросы', href: '#' },
      { label: 'Условия доставки', href: '#' },
      { label: 'Способы оплаты', href: '#' },
      { label: 'Возврат средств', href: '#' },
      { label: 'Поддержка', href: '#' },
    ],
  },
  {
    title: 'Юридическое',
    links: [
      { label: 'Пользовательское соглашение', href: '#' },
      { label: 'Политика конфиденциальности', href: '#' },
      { label: 'Договор оферты', href: '#' },
      { label: 'Обработка cookie', href: '#' },
    ],
  },
]

export const FOOTER_SOCIALS: IFooterSocial[] = [
  { label: 'Telegram', href: '#', icon: Send },
  { label: 'Instagram', href: '#', icon: Instagram },
  { label: 'Facebook', href: '#', icon: Facebook },
  { label: 'YouTube', href: '#', icon: Youtube },
]

export const FOOTER_CONTACTS = {
  phone: { label: '8 800 555-35-35', href: 'tel:+78005553535' },
  email: { label: 'help@foodhub.ru', href: 'mailto:help@foodhub.ru' },
  city: 'Санкт-Петербург, ежедневно 10:00–23:00',
} as const

export const FOOTER_PAYMENTS = ['Visa', 'Mastercard', 'МИР', 'SberPay'] as const

export const FOOTER_TAGLINE =
  'Доставка любимой еды из лучших ресторанов города. Быстро, тепло и с заботой о вкусе.'
