## Frontend Design Plugin

Generates distinctive, production-grade frontend interfaces that avoid generic AI aesthetics.

## What It Does

Claude automatically uses this skill for frontend work. Creates production-ready code with:

- Bold aesthetic choices
- Distinctive typography and color palettes
- High-impact animations and visual details
- Context-aware implementation

## Usage

```
"Create a dashboard for a music streaming app"
"Build a landing page for an AI security startup"
"Design a settings panel with dark mode"
```

Claude will choose a clear aesthetic direction and implement production code with meticulous attention to detail.

## Learn More

See the [Frontend Aesthetics Cookbook](https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb) for detailed guidance on prompting for high-quality frontend design.

## Authors

Prithvi Rajasekaran (prithvi@anthropic.com)
Alexander Bricken (alexander@anthropic.com) FSD Architecture Rules

Feature-Sliced Design v2.1. Нарушение этих правил — 🔴 Blocker в code review.

## Layers (строго сверху вниз)

```
src/
├── app/         # инициализация: router, store, styles, main.ts
├── pages/       # роутовые страницы — только композиция widgets/features
├── widgets/     # композитные UI-блоки (AdminSidebar, MenuHeader, DashboardStats)
├── features/    # пользовательские сценарии (product-form, menu-filter, category-manager)
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

## Три слоя внутри каждой фичи

Каждая фича разделена на три уровня ответственности:

| Слой | Файл | Содержит |
|---|---|---|
| **Business rules** | `model/domainName.ts` | Чистые функции: validate, transform, factory. Без Vue, без store. |
| **Logic** | `model/useXxx.ts` | Composable: реактивный state, watch, вызовы store/API. |
| **UI** | `ui/Component.vue` | Только шаблон и биндинги. `<script setup>` ≤ 10 строк. |

```
features/product-form/
├── model/
│   ├── types.ts          # MenuItemDraft и другие локальные типы
│   ├── dishDraft.ts      # чистые функции: defaultDraft, validate, productToDraft, draftToMenuItem
│   └── useDishForm.ts    # composable: form state + watch + save
├── ui/
│   ├── DishFormModal.vue # только шаблон — импортирует useDishForm
│   └── VariantEditor.vue # UI аккордеона вариантов
└── index.ts
```

## Страницы

Страница — тонкая оболочка. Она только:
1. Вызывает один page-composable (`useXxxPage`)
2. Регистрирует `onMounted`
3. Компонует виджеты и передаёт props/emits

```ts
// pages/admin/model/useMenuPage.ts — всё состояние страницы
// pages/admin/MenuPage.vue — только composition (≤ 20 строк script)
```

Page-composable возвращает **`reactive({})`** чтобы `v-model:prop="page.prop"` работало корректно.

## Структура slice (полная)

```
features/product-form/
├── ui/          # Vue-компоненты фичи
├── model/       # composables, чистые функции, локальные типы
├── api/         # HTTP-запросы (только через shared/api/http.ts)
├── lib/         # утилиты фичи
├── config/      # константы
└── index.ts     # public API (единственная точка входа)
```

## Naming

- Папки slice: `kebab-case`
- Компоненты: `PascalCase.vue`
- Composables: `useXxx.ts`
  - Feature composables → возвращают plain object `{ state, actions }`
  - Page composables → возвращают `reactive({ ... })` для v-model совместимости
- Stores: `useXxxStore` (Pinia setup style)
- Чистые функции / domain helpers: `camelCase.ts` (без `use` префикса)
- Interfaces: `IUser`, `IRestaurant`; type aliases: `OrderStatus`, `CartItem`
- API functions: глаголом — `fetchDishes`, `createOrder`, `updateProfile`

## HTTP запросы

Все HTTP — только через `shared/api/http.ts` (axios instance с interceptors).
API-функции — в `*/api/*.ts` файлах slice, не в компонентах.