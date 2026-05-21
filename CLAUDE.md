# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Operating contract

При работе над этим репозиторием следуй **`AI_TEAM.md`** — там зафиксированы: целевой стек (Vue 3 + TS + Vite + Pinia + Vue Router + Tailwind + VeeValidate/Zod, FSD v2.1, pnpm, Vitest, Playwright, ESLint+Prettier), архитектура (FSD-слои `app → pages → widgets → features → entities → shared`, public API через `index.ts`), роли AI-команды (Analyst/Architect/TeamLead/Designer/Developer/Reviewer), workflow modes (Quick/Feature/Full/Review/Architecture), API-контракт, антипаттерны и Definition of Done. Каждый ответ — на русском, код/коммиты/имена — на английском.

**Текущее состояние vs спека:** репозиторий пока — голый Vite-стартер. Из спека ничего не установлено (нет `pinia`, `vue-router`, `tailwindcss`, `axios`, `vee-validate`, `zod`, `vitest`, `playwright`, `eslint`, `prettier`, `pnpm-lock.yaml`), нет каталогов FSD. Перед первой фичей нужно установить зависимости и развернуть FSD-структуру — не реализовывать фичи поверх пустого стартера.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — type-check (`vue-tsc -b`) then produce a production build in `dist/`
- `npm run preview` — serve the built `dist/` locally to verify the production output

There is no test runner or linter configured yet. Type errors are surfaced at build time via `vue-tsc`; the project also has the strict-ish flags `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, and `noFallthroughCasesInSwitch` turned on in `tsconfig.app.json`.

## Stack & structure

Vue 3 + TypeScript + Vite scaffold (currently the default starter with a `HelloWorld` component — no feature code yet despite the "food-delivery" name).

- Entry: `src/main.ts` mounts `App.vue` onto `#app` in `index.html`. No router or state library is wired in.
- SFCs use `<script setup lang="ts">` — follow this style for new components.
- TypeScript is split into project references: `tsconfig.app.json` (browser code under `src/`, extends `@vue/tsconfig/tsconfig.dom.json`) and `tsconfig.node.json` (Vite/build tooling). When changing `tsconfig`, edit the right reference.
- Static assets imported from `src/assets/` go through Vite's asset pipeline; files under `public/` (e.g. `icons.svg` referenced via `<use href="/icons.svg#...">`) are served as-is at the root.