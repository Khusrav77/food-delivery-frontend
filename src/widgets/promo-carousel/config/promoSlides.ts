export interface IPromoSlide {
  id: string
  title: string
  subtitle: string
  ctaLabel: string
  bgClass: string
  emoji: string
  badge?: string
}

export const PROMO_SLIDES: IPromoSlide[] = [
  {
    id: '1',
    title: 'Доставка за 30 минут',
    subtitle: 'Горячая еда прямо к вашей двери',
    ctaLabel: 'Заказать',
    bgClass: 'bg-gradient-to-br from-sky-500 to-blue-700',
    emoji: '🛵',
  },
  {
    id: '2',
    title: 'Скидка 20%',
    subtitle: 'На первый заказ при регистрации',
    ctaLabel: 'Получить скидку',
    bgClass: 'bg-gradient-to-br from-orange-400 to-orange-600',
    emoji: '🎁',
    badge: '−20%',
  },
  {
    id: '3',
    title: 'Бесплатная доставка',
    subtitle: 'При заказе от 1 000 ₽',
    ctaLabel: 'Выбрать блюда',
    bgClass: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
    emoji: '🚀',
  },
  {
    id: '4',
    title: 'Пицца дня',
    subtitle: 'Маргарита с хрустящей корочкой — 590 ₽',
    ctaLabel: 'Попробовать',
    bgClass: 'bg-gradient-to-br from-red-500 to-rose-700',
    emoji: '🍕',
    badge: 'ХИТ',
  },
  {
    id: '5',
    title: 'Бонусная карта',
    subtitle: 'Кешбэк 5% с каждого заказа на счёт',
    ctaLabel: 'Оформить',
    bgClass: 'bg-gradient-to-br from-violet-500 to-indigo-700',
    emoji: '⭐',
    badge: 'НОВОЕ',
  },
]
