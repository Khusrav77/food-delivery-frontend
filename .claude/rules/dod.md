# Definition of Done

Задача считается готовой, когда выполнены **все** пункты.

## Type Safety
- [ ] `vue-tsc --noEmit` проходит без ошибок
- [ ] Все `props` типизированы через `defineProps<T>()`
- [ ] Все `emits` типизированы через `defineEmits<T>()`
- [ ] Нет `any`, нет `as unknown as T` без `// @ts-expect-error: <причина>`

## API & State
- [ ] Все API-вызовы обрабатывают: idle → loading → success → error → empty
- [ ] HTTP-запросы только через `*/api/*.ts`, не напрямую в компонентах
- [ ] Нет `console.log` в финальном коде

## UI Quality
- [ ] Responsive проверен на breakpoints: 375px (mobile), 768px (tablet), 1280px (desktop)
- [ ] Все интерактивные элементы имеют `:hover`, `:focus-visible`, `:disabled` состояния
- [ ] Нет магических строк/чисел — всё через константы

## Architecture
- [ ] FSD import rules соблюдены (только сверху вниз, нет cross-slice)
- [ ] Новые сущности зарегистрированы в public API slice (`index.ts`)
- [ ] `<script setup>` не длиннее ~150 строк

## Code Cleanliness
- [ ] Нет закомментированного кода
- [ ] Нет `v-for` с `index` как `:key` для динамических списков
- [ ] Если фича критичная — есть smoke-тест в Vitest