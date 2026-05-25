# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## .claude/ structure

```
.claude/
├── agents/                   # Sub-agents (активируются автоматически по описанию)
│   ├── code-reviewer.md      # Code review: FSD, Vue 3, TS — /review
│   ├── code-architect.md     # FSD структура, слои, контракты — /arch
│   ├── code-explorer.md      # Трассировка фичи: flow, слои, зависимости
│   ├── code-refactorer.md    # Рефакторинг без изменения поведения — /refactor
│   ├── code-debugger.md      # Поиск root cause багов — /debug
│   ├── code-test-writer.md   # Vitest + Vue Test Utils тесты — /test
│   ├── code-doc-writer.md    # JSDoc, SPEC.md, index.ts — /doc
│   └── code-security-auditor.md  # XSS, JWT, OWASP аудит — /audit
├── commands/                 # Slash-команды (/name или /name <аргумент>)
│   ├── run-app.md            # /run-app — запуск Postgres + Backend + Frontend
│   ├── review.md             # /review [файл] — code review
│   ├── arch.md               # /arch <вопрос/модуль> — архитектурное решение
│   ├── refactor.md           # /refactor [файл] — рефакторинг
│   ├── debug.md              # /debug <описание> — отладка бага
│   ├── test.md               # /test [файл/фича] — написать тесты
│   ├── doc.md                # /doc [файл/"spec"] — документация
│   ├── audit.md              # /audit [путь/"full"] — security аудит
│   ├── feature.md            # /feature <название> — Full Feature mode
│   └── dod.md                # /dod — Definition of Done checklist
├── rules/                    # Правила проекта (читать при каждой задаче)
│   ├── fsd.md                # FSD архитектура и import rules
│   ├── anti-patterns.md      # Запрещённые паттерны
│   ├── dod.md                # Definition of Done
│   └── code-style.md         # Code style и принципы
├── hooks/                    # Скрипты для Claude Code hooks
└── docs/
    ├── AI_TEAM.md            # Мастер-документ: роли, workflow modes, стек
    ├── SPEC.md               # Product spec: БД, типы, API endpoints, MVP
    └── FEATURE_DEV.md        # Гайд по Feature workflow: фазы, агенты, советы
```

**Правила читать перед каждой задачей:** `.claude/rules/fsd.md`, `.claude/rules/anti-patterns.md`
**Мастер-документ команды:** `.claude/docs/AI_TEAM.md`

## Slash-команды (быстрый старт)

| Команда | Что делает |
|---|---|
| `/run-app` | Запускает Postgres → Spring Boot → Vite (проверяет порты, не дублирует) |
| `/feature <название>` | Полный Feature mode: Analyst → Architect → Designer → Developer → Reviewer |
| `/review [файл]` | Code review по уровням 🔴/🟡/🟢 + Production Checklist |
| `/arch <вопрос>` | Архитектурное решение: слой, файловое дерево, зависимости |
| `/refactor [файл]` | Рефакторинг без изменения поведения |
| `/debug <описание>` | Поиск root cause + минимальный fix |
| `/test [файл]` | Vitest + Vue Test Utils тесты |
| `/doc [файл/"spec"]` | JSDoc или обновление SPEC.md |
| `/audit [путь/"full"]` | Security аудит: XSS, JWT, OWASP |
| `/dod` | Definition of Done чеклист |

Команды без аргумента работают с файлом открытым в редакторе.

## Git rules

- **Никогда не добавлять** `Co-Authored-By:` подпись в commit message.
- **Никогда не делать `git push`** после коммита — только коммит, push делает разработчик вручную.

## Operating contract

При работе над этим репозиторием следуй **`.claude/docs/AI_TEAM.md`** и правилам из **`.claude/rules/`**. Каждый ответ — на русском, код/коммиты/имена — на английском.

**Текущее состояние:** FSD-структура развёрнута, стек установлен (Vue 3 + Pinia + Vue Router + Tailwind). Admin-панель реализована со строгим разделением UI / Logic / Business Rules. API-слой подключён к реальному бэкенду.

## Commands

### Фронтенд
- `node node_modules/vite/bin/vite.js` — запуск dev-сервера (Node 22 через nvm)
- `npm run build` — type-check (`vue-tsc -b`) + production build в `dist/`
- `npm run preview` — превью production-сборки

> Нет test runner и linter. Ошибки типов — через `vue-tsc` при сборке. Флаги: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `noFallthroughCasesInSwitch`.

### Бэкенд (`~/GitProjects/Java-Repositories/foo-delivery-backend-app`)
- `docker compose -f docker/docker-compose.yml up -d` — запуск PostgreSQL (порт 5437)
- `./mvnw spring-boot:run` — запуск Spring Boot (порт 8080)

### Запуск полного стека (один раз)

```bash
# 1. Postgres (если не запущен)
docker compose -f ~/GitProjects/Java-Repositories/foo-delivery-backend-app/docker/docker-compose.yml up -d

# 2. Бэкенд (в отдельном терминале)
cd ~/GitProjects/Java-Repositories/foo-delivery-backend-app && ./mvnw spring-boot:run

# 3. Фронтенд (в отдельном терминале, Node 22)
cd ~/GitProjects/Vue/food-delivery-vue-app && node node_modules/vite/bin/vite.js
```

Приложение: **http://localhost:5173**

### Переменные окружения
- `.env` — `VITE_API_URL=/api/v1` (Vite proxy → Spring Boot :8080)
- Vite proxy `/api` → `http://localhost:8080` настроен в `vite.config.ts`

## Backend connection

Бэкенд: `~/GitProjects/Java-Repositories/foo-delivery-backend-app`
- Spring Boot 3, PostgreSQL (порт 5437, БД `food_delivery_db`)
- Base URL: `http://localhost:8080/api/v1`
- CORS настроен для `http://localhost:5173` (`config/WebConfig.java`)
- API-слой фронта: `src/shared/api/http.ts` (Axios + JWT interceptor)
- Entity API-функции: `src/entities/*/api/*.ts`

## Stack & structure

Vue 3 + TypeScript + Vite + Pinia + Vue Router + Tailwind CSS v4.

```
src/
├── app/              # router, layouts, styles
├── pages/
│   └── admin/
│       ├── model/    # page-composables (useMenuPage и др.)
│       └── *.vue     # тонкие страницы — только composition
├── widgets/
│   ├── admin-sidebar/
│   ├── admin-header/
│   ├── menu/         # MenuHeader, ProductFilters, CategoryTabs, ProductGrid, EmptyProducts
│   └── dashboard/    # DashboardStats, RecentOrdersTable, OrderStatusBreakdown, TopRestaurants
├── features/
│   ├── product-form/         # CRUD блюда
│   │   ├── model/
│   │   │   ├── types.ts      # MenuItemDraft
│   │   │   ├── dishDraft.ts  # чистые функции: validate, transform
│   │   │   └── useDishForm.ts
│   │   └── ui/
│   ├── menu-filter/          # фильтрация меню (useMenuFilter)
│   ├── category-manager/     # CRUD категорий (useCategoryManager)
│   └── tag-manager/          # CRUD тегов (useTagManager)
├── entities/
│   ├── dish/         # Product/MenuItem: types, store, api, ui/DishCard
│   ├── category/     # types, store, api
│   └── tag/          # types, store, api, ui/TagBadge
└── shared/
    ├── api/          # http.ts (Axios + JWT interceptor)
    └── ui/
        ├── StatsCard/
        └── UnderConstruction/  # виджет-заглушка для страниц "в разработке"
```

### Ключевые архитектурные правила

- **Три слоя:** `model/domainName.ts` (бизнес-правила) → `model/useXxx.ts` (логика) → `ui/*.vue` (только шаблон)
- **Page composable** возвращает `reactive({})` для поддержки `v-model:prop="page.prop"`
- **Страница** вызывает один composable + `onMounted` + компонует виджеты
- SFCs используют `<script setup lang="ts">` — без исключений
- Импорты только через `index.ts` каждого slice (public API)
- TypeScript: `tsconfig.app.json` (src/), `tsconfig.node.json` (vite/tooling)
- Статика из `src/assets/` — через Vite pipeline; `public/` — as-is
