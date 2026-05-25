export interface IPromoSlide {
  id: string
  title: string
  subtitle: string
  ctaLabel: string
  bgClass: string
  emoji: string
}

export const PROMO_SLIDES: IPromoSlide[] = [
  {
    id: '1',
    title: 'Быстрая доставка',
    subtitle: 'Горячая еда у вашей двери за 30 минут',
    ctaLabel: 'Заказать сейчас',
    bgClass: 'bg-gradient-to-br from-orange-500 to-amber-400',
    emoji: '🍕',
  },
  {
    id: '2',
    title: 'Скидка 20%',
    subtitle: 'На первый заказ после регистрации',
    ctaLabel: 'Получить скидку',
    bgClass: 'bg-gradient-to-br from-slate-800 to-slate-900',
    emoji: '🎁',
  },
  {
    id: '3',
    title: 'Бесплатная доставка',
    subtitle: 'При заказе на сумму от 1 000 ₽',
    ctaLabel: 'Выбрать блюда',
    bgClass: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    emoji: '🚀',
  },
]
