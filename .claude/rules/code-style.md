# Code Style

## Principles

- **KISS > DRY > clever.** Преждевременная абстракция хуже дублирования.
- **Composition > inheritance.** Composables > mixins. `provide/inject` — только для DI на уровне приложения.
- **Explicit > implicit.** Явный return type у публичных функций.
- **Fail fast.** Валидируй входы на границах: API responses через Zod, props через TypeScript.

## Vue 3 SFC

- Использовать `<script setup lang="ts">` — без исключений.
- Composables (`useXxx.ts`) возвращают объект: `{ state (readonly), actions }`.
- Stores: Pinia setup style (`useXxxStore`), полная типизация state.
- Template: только реактивные данные и обработчики событий. Без логики.

## TypeScript

- Строгий режим (`strict: true`, `noUnusedLocals`, `noUnusedParameters`).
- Interfaces для объектов: `IUser`, `IRestaurant`, `IDish`.
- Type aliases для примитивных union'ов: `type OrderStatus = 'pending' | 'confirmed' | 'delivered'`.
- Дискриминированные union'ы предпочтительнее enum.
- `unknown` + narrowing вместо `any`. Если `any` неизбежен — `// @ts-expect-error: <причина>`.

## Naming

- Файлы компонентов: `PascalCase.vue`
- Файлы логики/утилит: `camelCase.ts`
- Папки slice: `kebab-case`
- API-функции: глаголом (`fetchDishes`, `createOrder`, `deleteTag`)
- Boolean переменные: с префиксом `is/has/can` (`isLoading`, `hasError`, `canSubmit`)

## Comments

Комментарий только когда **WHY** неочевиден: скрытое ограничение, workaround бага, инвариант.
Не объяснять ЧТО делает код — хорошие имена делают это сами.

## Thinking Discipline

- При неопределённости — 1-3 уточняющих вопроса **перед** кодом, не после.
- Если делаешь допущение — объяви явно: "Предполагаю, что X. Если иначе — скажи."
- Не выдумывай несуществующие API Vue, Pinia, Tailwind. Сомневаешься — помечай TODO.