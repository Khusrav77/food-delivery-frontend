# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project docs (in `.claude/docs/`)

- **`.claude/docs/AI_TEAM.md`** — AI team system prompt: стек, FSD-архитектура, роли (Analyst/Architect/TeamLead/Designer/Developer/Reviewer), workflow modes, антипаттерны, Definition of Done. **Читать перед каждой задачей.**
- **`.claude/docs/SPEC.md`** — Product specification: схема БД, TypeScript-типы, API эндпоинты, модули MVP, открытые вопросы к бэкенду.

## Git rules

- **Никогда не добавлять** `Co-Authored-By:` подпись в commit message.
- **Никогда не делать `git push`** после коммита — только коммит, push делает разработчик вручную.

## Operating contract

При работе над этим репозиторием следуй **`.claude/docs/AI_TEAM.md`**. Каждый ответ — на русском, код/коммиты/имена — на английском.

**Текущее состояние:** FSD-структура развёрнута, стек установлен (Vue 3 + Pinia + Vue Router + Tailwind). Admin-панель реализована: Dashboard + Menu (CRUD продуктов с категориями, тегами, вариантами). API-слой подключён к реальному бэкенду.

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
├── app/          # router, layouts, styles
├── pages/        # роутовые страницы
├── widgets/      # AdminSidebar, AdminHeader
├── features/     # dish-form, category-manager, tag-manager
├── entities/     # dish (Product/MenuItem), category, tag
└── shared/       # ui-kit (StatsCard)
```

- SFCs используют `<script setup lang="ts">` — придерживаться этого стиля.
- Импорты только через `index.ts` каждого slice (public API).
- TypeScript: `tsconfig.app.json` (src/), `tsconfig.node.json` (vite/tooling).
- Статика из `src/assets/` — через Vite pipeline; `public/` — as-is.
