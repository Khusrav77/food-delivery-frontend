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
| **Customer** | Мобильное приложение | Просматривает меню, делает заказы, отслеживает доставку |
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

---

## 4. TypeScript-типы (frontend → DB mapping)

```typescript
// entities/tag        → tags
// entities/category   → categories
// entities/dish       → products + menu_items + menu_item_images + menu_item_sizes + menu_item_tags

interface Tag {
  id: string
  label: string         // tags.label
  color?: TagColor      // UI-only
  emoji?: string        // UI-only
}

interface Category {
  id: string
  name: string
  imageUrl: string | null
  position: number
  createdAt: string
  updatedAt: string
}

interface MenuItemSize {
  id: string
  menuItemId: string
  sizeType: 'weight' | 'volume' | 'diameter' | 'count'
  sizeValue: number
  sizeUnit: 'gram' | 'kg' | 'ml' | 'l' | 'cm' | 'piece'
}

interface MenuItemImage {
  id: string
  menuItemId: string
  url: string
  position: number
}

interface MenuItem {          // = menu_items + relations
  id: string
  productId: string
  name: string
  price: number
  isActive: boolean
  position: number
  images: MenuItemImage[]
  sizes: MenuItemSize[]
  tagIds: string[]
}

interface Product {           // = products + joined menu_items
  id: string
  categoryId: string | null
  name: string
  description: string
  isActive: boolean
  position: number
  createdAt: string
  updatedAt: string
  menuItems: MenuItem[]
}
```

---

## 5. API эндпоинты (предполагаемые, уточнить у бэкенда)

### Auth
```
POST   /auth/login              → { token, refreshToken, user }
POST   /auth/register           → { token, user }
POST   /auth/refresh            → { token }
POST   /auth/logout
```

### Categories
```
GET    /categories              → Category[]
POST   /categories              → Category
PATCH  /categories/:id          → Category
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

### Orders (из iOS-модели)
```
GET    /orders                  → MyOrder[]  ?status= &userId=
GET    /orders/:id              → MyOrder
POST   /orders                  → MyOrder
PATCH  /orders/:id/status       → { status: OrderStatus }
```

### Users / Auth profile
```
GET    /users/me                → UserFull
PATCH  /users/me                → UserFull
GET    /users/me/addresses      → Address[]
POST   /users/me/addresses      → Address
PATCH  /users/me/addresses/:id  → Address
DELETE /users/me/addresses/:id
```

### Promo Codes
```
GET    /promo-codes             → PromoCode[]
POST   /promo-codes/validate    → { valid: boolean, discount: number }
```

---

## 6. Модули приложения (MVP)

### 6.1 Admin Panel `/admin`

| Страница | Путь | Статус | Описание |
|---|---|---|---|
| Dashboard | `/admin/dashboard` | ✅ Готово | Статистика, последние заказы |
| Меню | `/admin/menu` | ✅ Готово | CRUD продуктов, вариантов, тегов, категорий |
| Заказы | `/admin/orders` | ⬜ Заглушка | Список заказов, фильтры, статусы |
| Рестораны | `/admin/restaurants` | ⬜ Заглушка | Управление ресторанами |
| Курьеры | `/admin/couriers` | ⬜ Заглушка | Список курьеров, статусы |
| Клиенты | `/admin/customers` | ⬜ Заглушка | База клиентов |
| Аналитика | `/admin/analytics` | ⬜ Заглушка | Графики, отчёты |
| Промоакции | `/admin/promotions` | ⬜ Заглушка | Промокоды, баннеры |
| Настройки | `/admin/settings` | ⬜ Заглушка | Конфигурация |

### 6.2 Customer App (будущее)

| Модуль | Описание |
|---|---|
| Auth | Login (phone/email/Google/Apple), register, OTP |
| Catalog | Список ресторанов с фильтрами (кухня, рейтинг, время, цена) |
| Restaurant Page | Меню категории → продукт → варианты, info, reviews |
| Cart | Добавление, количество, промокод, расчёт total |
| Checkout | Адрес, время, способ оплаты (cash/card/online) |
| Orders | История, текущий заказ, статус-трекинг |
| Favorites | Избранные рестораны / блюда |
| Profile | Данные, адреса, способы оплаты, уведомления |

---

## 7. Модели из iOS-приложения (справка)

Из существующего iOS-клиента (`FoodDeliveryApp`):

```swift
// Соответствие: iOS → Backend DB
ProductCategory   → categories (+ products)
Product           → products + menu_items (ProductBase=product, ProductDetail=menu_item)
Price             → menu_items.price (regularPrice / discountedPrice)
Promotion         → (отдельная таблица — нужно добавить в схему БД)
Nutrition         → (отдельная таблица — нужно добавить в схему БД)
MyOrder           → orders (нужна таблица в схеме)
CartItem          → cart + cart_items (нужны таблицы в схеме)
Address           → addresses (нужна таблица в схеме)
Payment           → payment_methods (нужна таблица в схеме)
PromoCode         → promo_codes (нужна таблица в схеме)
UserBase/UserFull → users (нужна таблица в схеме)
```

> **Вывод:** В текущей схеме БД реализована только часть меню. Для полного MVP нужно добавить таблицы: `users`, `orders`, `order_items`, `cart`, `cart_items`, `addresses`, `payment_methods`, `promo_codes`, `promotions`, `nutrition`.

---

## 8. Definition of Done (для каждого модуля)

- [ ] TypeScript типы aligned с DB-схемой
- [ ] Pinia store с методами: fetch (loading/error/success), CRUD
- [ ] Все состояния обработаны: loading skeleton, error state, empty state
- [ ] Responsive: 375px / 768px / 1280px
- [ ] Hover / focus-visible / disabled состояния на интерактивных элементах
- [ ] API-вызовы только через `*/api/*.ts`, не напрямую в компоненте
- [ ] Данные валидируются через Zod на границе API (response parsing)
- [ ] Нет `console.log` в финальном коде
- [ ] Public API через `index.ts` у каждого slice

---

## 9. Открытые вопросы для бэкенда

1. **Недостающие таблицы** — нужны схемы для: `users`, `orders`, `cart`, `addresses`, `promo_codes`
2. **Promotions** — iOS-модель `Promotion` есть, но в DB schema не видно таблицы
3. **Nutrition** — iOS-модель `Nutrition` (калории, белки, жиры) — будет ли в DB?
4. **Response format** — подтвердить: `{ data: T }` для одиночного, `{ data: T[], meta: { total, page } }` для коллекции?
5. **Auth** — JWT в `Authorization: Bearer`? Refresh через `/auth/refresh`?
6. **Картинки** — загрузка через отдельный endpoint (`POST /upload`) или внешний CDN (URL напрямую)?
7. **Мультиресторанность** — один ресторан или несколько? В текущей схеме нет таблицы `restaurants`
