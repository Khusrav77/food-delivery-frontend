# Food Delivery — Project Specification

## 1. Обзор проекта

**Тип:** Food Delivery SaaS — мобильное приложение + веб-админ-панель  
**Стек фронта:** Vue 3 + TypeScript + Vite + Pinia + Vue Router + Tailwind CSS (FSD v2.1)  
**API:** REST, Base URL: `VITE_API_URL`, auth: JWT Bearer  
**База данных:** PostgreSQL, schema: `food_delivery`

---

## 2. Роли пользователей

| Роль | Доступ | Описание |
|---|---|---|
| **Customer** | Клиентский сайт | Просматривает меню, делает заказы, отслеживает доставку |
| **Admin** | Веб-панель `/admin` | Управляет меню, заказами, ресторанами, курьерами, промоакциями |
| **Courier** | Мобильное приложение | Принимает и доставляет заказы |
| **Restaurant** | Веб или мобильное | Управляет своим меню и статусами заказов |

---

## 3. Схема данных (PostgreSQL, schema: food_delivery)

### 3.1 Иерархия меню

```
categories
  └── products          (блюдо: Ролл Филадельфия)
        └── menu_items  (вариант: 4 шт за 400₽)
              ├── menu_item_images  (фото варианта)
              ├── menu_item_sizes   (вес, диаметр, объём)
              └── menu_item_tags    (M2M → tags)
```

### 3.2 Таблицы

#### `categories`
| Поле | Тип | Описание |
|---|---|---|
| id | UUID PK | |
| name | VARCHAR(20) | Роллы, Пицца, Суши |
| image_url | VARCHAR(200) | nullable |
| position | INT | порядок отображения |
| created_at / updated_at | TIMESTAMP | |

#### `products`
| Поле | Тип | Описание |
|---|---|---|
| id | UUID PK | |
| category_id | UUID FK → categories | ON DELETE CASCADE |
| name | VARCHAR(20) | |
| description | TEXT | nullable |
| is_active | BOOLEAN | видимость для клиента |
| position | INT | порядок в категории |
| created_at / updated_at | TIMESTAMP | |

#### `menu_items`
| Поле | Тип | Описание |
|---|---|---|
| id | UUID PK | |
| product_id | UUID FK → products | ON DELETE CASCADE |
| name | VARCHAR(20) | "4 шт", "20 см", "0.5 л" |
| price | NUMERIC(10,2) | цена варианта |
| is_active | BOOLEAN | |
| position | INT | порядок вариантов |
| created_at / updated_at | TIMESTAMP | |

#### `menu_item_images`
| Поле | Тип | Описание |
|---|---|---|
| id | UUID PK | |
| menu_item_id | UUID FK → menu_items | ON DELETE CASCADE |
| url | VARCHAR(200) | |
| position | INT | порядок в галерее |

#### `menu_item_sizes`
| Поле | Тип | Описание |
|---|---|---|
| id | UUID PK | |
| menu_item_id | UUID FK → menu_items | ON DELETE CASCADE |
| size_type | VARCHAR(20) | "weight" / "volume" / "diameter" / "count" |
| size_value | NUMERIC | 200, 30, 330 |
| size_unit | VARCHAR(10) | "gram" / "ml" / "cm" / "piece" |

#### `tags`
| Поле | Тип | Описание |
|---|---|---|
| id | UUID PK | |
| label | VARCHAR(20) UNIQUE | "Хит", "Новинка", "Острый" |

> **Примечание:** `color` и `emoji` — UI-only поля на фронтенде, в БД не хранятся.

#### `menu_item_tags` (M2M)
| Поле | Тип | Описание |
|---|---|---|
| id | UUID PK | |
| menu_item_id | UUID FK → menu_items | |
| tag_id | UUID FK → tags | |
| UNIQUE(menu_item_id, tag_id) | | |

#### `users`
| Поле | Тип | Описание |
|---|---|---|
| id | UUID PK | |
| name | VARCHAR(100) | отображаемое имя |
| bonus_balance | INT DEFAULT 0 | текущий бонусный баланс |
| created_at / updated_at | TIMESTAMP | |

> Расширенный профиль (email, phone, password_hash, role) — на стороне бэкенда.

#### `addresses`
| Поле | Тип | Описание |
|---|---|---|
| id | UUID PK | |
| user_id | UUID FK → users | ON DELETE CASCADE |
| label | VARCHAR(10) | "home" / "work" / "other" |
| street | VARCHAR(200) | |
| house | VARCHAR(20) | |
| apartment | VARCHAR(20) | nullable |
| entrance | VARCHAR(10) | nullable |
| floor | VARCHAR(10) | nullable |
| comment | TEXT | комментарий курьеру |
| is_primary | BOOLEAN DEFAULT false | |
| created_at / updated_at | TIMESTAMP | |

#### `orders`
| Поле | Тип | Описание |
|---|---|---|
| id | UUID PK | |
| number | VARCHAR(20) UNIQUE | читаемый номер "A-1234" |
| user_id | UUID FK → users | |
| address | TEXT | строка адреса (снимок на момент заказа) |
| comment | TEXT | комментарий к заказу |
| payment_method | VARCHAR(10) | "cash" / "card" / "sbp" |
| status | VARCHAR(20) | "accepted" / "cooking" / "on_the_way" / "delivered" |
| subtotal | NUMERIC(10,2) | сумма товаров |
| delivery_cost | NUMERIC(10,2) | стоимость доставки |
| promo_discount | NUMERIC(10,2) DEFAULT 0 | скидка промокода |
| bonus_used | INT DEFAULT 0 | списанные бонусы |
| tip | NUMERIC(10,2) DEFAULT 0 | чаевые |
| total | NUMERIC(10,2) | итоговая сумма |
| promo_code | VARCHAR(50) | nullable |
| eta_minutes | INT | примерное время доставки |
| created_at / updated_at | TIMESTAMP | |

#### `order_items`
| Поле | Тип | Описание |
|---|---|---|
| id | UUID PK | |
| order_id | UUID FK → orders | ON DELETE CASCADE |
| product_name | VARCHAR(100) | снимок имени продукта |
| variant_name | VARCHAR(100) | снимок имени варианта |
| price | NUMERIC(10,2) | цена на момент заказа |
| quantity | INT | |

---

## 4. TypeScript-типы (frontend → DB mapping)

```typescript
// entities/tag        → tags
// entities/category   → categories
// entities/dish       → products + menu_items + menu_item_images + menu_item_sizes + menu_item_tags
// entities/user       → users
// entities/address    → addresses
// entities/order      → orders + order_items
// entities/favorite   → localStorage (client-only, нет таблицы в БД)
// entities/banner     → localStorage (client+admin, нет таблицы в БД; seed из src/assets/*.jpeg)
//                       image хранит `preset:<id>` или URL; resolveBannerImage() резолвит на рендере
// entities/cart       → in-memory Pinia store (нет персиста; CartItem: menuItemId, qty, price, image)
// shared/lib/validators.ts → EMAIL_RE, PHONE_RE, isEmail, isPhone, isIdentifier (единый источник)

interface IUser {
  id: string
  name: string
  bonusBalance: number
}

interface IAddress {
  id: string
  label: 'home' | 'work' | 'other'
  street: string
  house: string
  apartment: string
  entrance: string
  floor: string
  comment: string
  isPrimary: boolean
}

type PaymentMethod = 'cash' | 'card' | 'sbp'
type OrderStatus   = 'accepted' | 'cooking' | 'on_the_way' | 'delivered'

interface OrderItem {
  productName: string
  variantName: string
  price: number
  quantity: number
}

interface PlaceOrderPayload {
  items: OrderItem[]
  address: string
  comment: string
  paymentMethod: PaymentMethod
  promoCode: string | null
  bonusUsed: number
  tip: number
  subtotal: number
  deliveryCost: number
  promoDiscount: number
  total: number
  etaMinutes: number
}

interface PlacedOrder {
  id: string
  number: string
  status: OrderStatus
  total: number
  etaMinutes: number
  createdAt: string
  payload: PlaceOrderPayload
}

interface Tag { id: string; label: string; color?: TagColor; emoji?: string }

interface Category {
  id: string; name: string; imageUrl: string | null
  position: number; createdAt: string; updatedAt: string
}

interface MenuItem {
  id: string; productId: string; name: string; price: number
  isActive: boolean; position: number
  images: MenuItemImage[]; sizes: MenuItemSize[]; tagIds: string[]
}

interface Product {
  id: string; categoryId: string | null; name: string; description: string
  isActive: boolean; position: number; createdAt: string; updatedAt: string
  menuItems: MenuItem[]
}
```

---

## 5. API эндпоинты

### Auth
```
POST   /auth/login              → { token, refreshToken, user }
POST   /auth/register           → { token, user }
POST   /auth/refresh            → { token }
POST   /auth/logout
POST   /auth/password-reset     → { message }      (запрос сброса)
POST   /auth/password-reset/confirm  → { message } (подтверждение нового пароля)
```

### Users / Profile
```
GET    /users/me                → UserFull
PATCH  /users/me                → UserFull
```

### Addresses
```
GET    /users/me/addresses      → IAddress[]
POST   /users/me/addresses      → IAddress
PATCH  /users/me/addresses/:id  → IAddress
DELETE /users/me/addresses/:id
PATCH  /users/me/addresses/:id/set-primary
```

### Categories
```
GET    /categories              → Category[]
POST   /categories              → Category
PUT    /categories/:id          → Category
DELETE /categories/:id
```

### Products (меню)
```
GET    /products                → Product[]          ?categoryId= &isActive=
GET    /products/:id            → Product
POST   /products                → Product
PATCH  /products/:id            → Product
DELETE /products/:id
PATCH  /products/:id/toggle     → { isActive: boolean }
```

### Menu Items (варианты)
```
GET    /products/:productId/menu-items       → MenuItem[]
POST   /products/:productId/menu-items       → MenuItem
PATCH  /menu-items/:id                       → MenuItem
DELETE /menu-items/:id
POST   /menu-items/:id/images                → MenuItemImage
DELETE /menu-items/:menuItemId/images/:imgId
POST   /menu-items/:id/sizes                 → MenuItemSize
DELETE /menu-items/:menuItemId/sizes/:sizeId
```

### Tags
```
GET    /tags                    → Tag[]
POST   /tags                    → Tag
DELETE /tags/:id
PUT    /menu-items/:id/tags     → string[]   (заменяет все теги)
```

### Orders
```
POST   /orders                  → PlacedOrder         (создать заказ — checkout)
GET    /orders                  → PlacedOrder[]       ?status= &userId=
GET    /orders/:id              → PlacedOrder
PATCH  /orders/:id/status       → { status: OrderStatus }
POST   /orders/:id/cancel       → PlacedOrder         (активно до on_the_way)
POST   /orders/:id/rating       → PlacedOrder         (OrderRating: stars 1..5 + comment — §1.8)
```

> **§1.7 трекинг:** статус двигает бэкенд; фронт опрашивает `GET /orders/:id` (polling/WS). В mock-режиме прогресс имитируется таймером `features/order-tracking` (см. `advanceOrderStatus`).

### Delivery Zones  *(MOCK на фронте — эндпоинт будет после §2.4)*
```
GET    /delivery-zones/detect   → ZoneInfo   ?street= &house=
GET    /delivery-zones          → DeliveryZone[]       (admin)
POST   /delivery-zones          → DeliveryZone         (admin)
PATCH  /delivery-zones/:id      → DeliveryZone         (admin)
DELETE /delivery-zones/:id                             (admin)
```

### Promo Codes  *(MOCK на фронте — эндпоинт будет после §2.7)*
```
POST   /promo/apply             → PromoResult   { code, discount }
GET    /promo-codes             → PromoCode[]          (admin)
POST   /promo-codes             → PromoCode            (admin)
PATCH  /promo-codes/:id         → PromoCode            (admin)
```

### Bonuses
```
GET    /users/me/bonuses        → { balance: number, history: BonusEntry[] }
```

---

## 6. Модули приложения (MVP)

### 6.1 Admin Panel `/admin`

| Страница | Путь | Статус | Описание |
|---|---|---|---|
| Dashboard | `/admin/dashboard` | ✅ Готово | Статистика, последние заказы |
| Меню | `/admin/menu` | ✅ Готово | CRUD продуктов, вариантов, тегов, категорий |
| Заказы | `/admin/orders`, `/admin/orders/:id` | ✅ Готово | Таблица с фильтрами, детали + смена статуса + назначение курьера (§2.3) |
| Рестораны | `/admin/restaurants` | ⬜ Заглушка | Управление ресторанами |
| Курьеры | `/admin/couriers` | ⬜ Заглушка | Список курьеров, статусы |
| Клиенты | `/admin/customers` | ⬜ Заглушка | База клиентов |
| Аналитика | `/admin/analytics` | ⬜ Заглушка | Графики, отчёты |
| Промоакции | `/admin/promotions` | ✅ Готово | Промокоды: CRUD, toggle активности |
| Баннеры | `/admin/banners` | ✅ Готово | CRUD баннеров карусели + drag-сортировка; localStorage persist |
| Настройки | `/admin/settings` | ⬜ Заглушка | Конфигурация |

### 6.2 Customer Site (ветка `feat/client`)

| Модуль | Путь | Статус | Описание |
|---|---|---|---|
| Главная / меню | `/` | ✅ Готово | Промокарусель (картинки-баннеры, autoplay 4s, swipe + dots, пауза на hover); scroll-spy категории; карточки блюд 4-кол (2→3→4); cart-stepper [−N+] прямо в карточке; модал-превью, back-to-top |
| Корзина | drawer | ✅ Готово | Список товаров, qty (+/−), итог, переход на checkout; qty также управляется stepper-ом прямо в карточке |
| Оформление заказа | `/checkout` | ✅ Готово | Адрес (saved + new), зона, оплата, промокод, бонусы, чаевые, сводка; mobile sticky bottom bar |
| Успешный заказ | `/checkout/success` | ✅ Готово | Номер заказа, итог, ETA, кнопка в меню |
| Auth (вход/регистрация) | `/login`, `/register` | ✅ Готово | Формы, валидация (shared/lib/validators), JWT, восстановление пароля (§1.1) |
| Личный кабинет | `/account/*` | ✅ Готово | Профиль, адреса, история заказов, бонусы, промокоды, карты, реферал (§1.2–§1.11); mobile 4+«Ещё» nav |
| Избранное | `/favorites` | ✅ Готово | Сетка избранных блюд 4-кол (2→3→4), empty state; store в entities/favorite |
| Поиск | `/search` | ✅ Готово | Глобальный поиск + фильтры (категория, тег, цена) 4-кол (2→3→4); page composable useSearchPage |
| Отслеживание заказа | `/orders/:id/track` | ✅ Готово | Статус-шкала, ETA, отмена (до on_the_way), авто-прогресс (§1.7) |
| Оценка заказа | модал | ✅ Готово | Звёзды 1–5, комментарий, авто-открытие после доставки (§1.8) |
| Toast-уведомления | shared | ✅ Готово | success/error/info/warning (§1.9) |
| Публичный футер | layout | ✅ Готово | Бренд, nav-колонки, контакты, соцсети, app badges, платёжные методы |

---

## 7. Checkout — детали реализации

### Зоны доставки (mock-правило, до §2.4)
| Условие адреса | Зона | Стоимость | Мин. заказ | ETA |
|---|---|---|---|---|
| улица содержит «далеко»/«far» | `none` | — | — | — |
| номер дома > 100 | `paid` | 199 ₽ | 800 ₽ | 60 мин |
| иначе | `free` | 0 ₽ | 600 ₽ | 45 мин |

### Промокоды (mock, до §2.7)
| Код | Тип | Размер |
|---|---|---|
| `WELCOME` | % | −10% от суммы товаров |
| `FIX200` | fixed | −200 ₽ |

### Бонусы
- Максимум к списанию: `min(balance, floor(subtotal × 0.5))`
- Процент (50%) настраивается в `features/checkout/config/checkout.ts → MAX_BONUS_PCT`

### Чаевые
- Пресеты: 5%, 10% от суммы товаров, своя сумма, без
- Конфигурация: `TIP_PERCENTS` в том же файле

---

## 8. Недостающие таблицы для полного MVP

| Таблица | Статус | Назначение |
|---|---|---|
| `users` | ⬜ | Покупатели, администраторы, курьеры |
| `addresses` | ⬜ | Адреса доставки (на фронте mock) |
| `orders` | ⬜ | Заказы (на фронте mock POST) |
| `order_items` | ⬜ | Позиции заказа |
| `delivery_zones` | ⬜ | Полигоны зон доставки (§2.4) |
| `promo_codes` | ⬜ | Промокоды (§2.7) |
| `promotions` | ⬜ | Акционные периоды (баннеры сейчас в localStorage через entities/banner) |
| `nutrition` | ⬜ | Пищевая ценность |

---

## 9. Definition of Done (для каждого модуля)

- [ ] TypeScript типы aligned с DB-схемой
- [ ] Pinia store с методами: fetch (loading/error/success), CRUD
- [ ] Все состояния обработаны: loading skeleton, error state, empty state
- [ ] Responsive: 375px / 768px / 1280px
- [ ] Hover / focus-visible / disabled состояния на интерактивных элементах
- [ ] API-вызовы только через `*/api/*.ts`, не напрямую в компоненте
- [ ] Нет `console.log` в финальном коде
- [ ] Public API через `index.ts` у каждого slice

---

## 10. Открытые вопросы для бэкенда

1. **Схемы новых таблиц** — нужны контракты: `users`, `orders`, `addresses`, `delivery_zones`, `promo_codes`
2. **Promotions** — iOS-модель `Promotion` есть, но в DB schema не видно таблицы
3. **Nutrition** — iOS-модель `Nutrition` (калории, белки, жиры) — будет ли в DB?
4. **Response format** — подтвердить: `{ data: T }` для одиночного, `{ data: T[], meta: { total, page } }` для коллекции?
5. **Auth** — JWT в `Authorization: Bearer`? Refresh через `/auth/refresh`?
6. **Картинки** — загрузка через отдельный endpoint (`POST /upload`) или внешний CDN (URL напрямую)?
7. **Мультиресторанность** — один ресторан или несколько? В текущей схеме нет таблицы `restaurants`
8. **Delivery zones endpoint** — формат ответа `/delivery-zones/detect`? Полигоны (GeoJSON) или простой маппинг?
