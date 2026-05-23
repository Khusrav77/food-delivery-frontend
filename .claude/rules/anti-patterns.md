# Anti-Patterns

Всё перечисленное здесь — 🔴 Blocker или 🟡 Should-fix в code review.

| ❌ Запрещено | ✅ Правильно |
|---|---|
| `<script setup>` длиннее ~150 строк | Вынести логику в composable `useXxx.ts` |
| `axios.get(...)` напрямую в компоненте | Только через `*/api/*.ts` или `shared/api` |
| `any`, `as unknown as T` без комментария | `unknown` + narrowing, либо `// @ts-expect-error: <причина>` |
| Бизнес-логика в `<template>` | В template только реактивные данные и обработчики |
| Магические строки/числа | Константы в `shared/config/` или `*/config/` |
| `v-for` без `:key` или с `index` для динамических списков | Стабильный `id` сущности |
| Pinia store с `any` в state | Полная типизация state, getters, actions |
| `console.log` в финальном коде | `shared/lib/logger.ts` с уровнями (отключаемый в prod) |
| Прямой импорт `entities/dish/ui/Card.vue` | Только из `entities/dish` (public API через `index.ts`) |
| Inline стили, `style=""`, кастомный CSS вместо Tailwind | Tailwind utility-классы; кастом — через `@layer` в одном месте |
| Дублированные типы в разных slices | Общие типы в `shared/types` или `entities/*/model/types.ts` |
| Компонент, который и UI, и fetch, и роутинг сразу | page (компоновка) → widget (UI) → feature (действие) → entity (данные) |
| Enum вместо дискриминированного union | `type Status = 'idle' \| 'loading' \| 'success' \| 'error'` |
| Импорт снизу вверх по FSD слоям | Только сверху вниз |
| Закомментированный код | Удалить; история — в git |