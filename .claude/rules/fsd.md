# FSD Architecture Rules

Feature-Sliced Design v2.1. Нарушение этих правил — 🔴 Blocker в code review.

## Layers (строго сверху вниз)

```
src/
├── app/         # инициализация: router, store, styles, main.ts
├── pages/       # роутовые страницы — только композиция widgets/features
├── widgets/     # композитные UI-блоки (AdminSidebar, CartSidebar)
├── features/    # пользовательские сценарии (add-to-cart, dish-form)
├── entities/    # бизнес-сущности (dish, category, tag, order, user)
└── shared/      # ui-kit, api client, lib, config, types
```

## Import rules

1. **Только сверху вниз.** `pages` → `widgets` → `features` → `entities` → `shared`. Обратное направление запрещено.
2. **Slices одного уровня** не импортируют друг друга. Композиция — через уровень выше.
3. **Public API через `index.ts`.** Внешний код импортирует только из `index.ts` slice, не из внутренних файлов.

```ts
// ✅ Правильно
import { DishCard } from '@/entities/dish'

// ❌ Запрещено
import { DishCard } from '@/entities/dish/ui/DishCard.vue'
```

## Структура slice

```
features/add-to-cart/
├── ui/          # Vue-компоненты фичи
├── model/       # Pinia store, типы, бизнес-логика
├── api/         # HTTP-запросы (только через shared/api/http.ts)
├── lib/         # утилиты фичи
├── config/      # константы
└── index.ts     # public API (единственная точка входа)
```

## Naming

- Папки slice: `kebab-case`
- Компоненты: `PascalCase.vue`
- Composables: `useXxx.ts`, возвращают объект с readonly state + actions
- Stores: `useXxxStore` (Pinia setup style)
- Interfaces: `IUser`, `IRestaurant`; type aliases: `OrderStatus`, `CartItem`
- API functions: глаголом — `fetchDishes`, `createOrder`, `updateProfile`
- Logic files: `camelCase.ts`

## HTTP запросы

Все HTTP — только через `shared/api/http.ts` (axios instance с interceptors).
API-функции — в `*/api/*.ts` файлах slice, не в компонентах.