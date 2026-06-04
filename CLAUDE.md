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
│   ├── code-security-auditor.md  # XSS, JWT, OWASP аудит — /audit
│   └── code-frontend-design.md  # Дизайн UI: компоненты, страницы, анимации
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
├── skills/                   # Внешние скилы с базами знаний
│   └── ui-ux-pro-max/        # 67 стилей, 96 палитр, 57 шрифт-пар, UX-правила — /ui-ux-pro-max
├── hooks/                    # Скрипты для Claude Code hooks
└── docs/
    ├── AI_TEAM.md            # Мастер-документ: роли, workflow modes, стек
    ├── SPEC.md               # Product spec: БД, типы, API endpoints, MVP
    ├── FEATURE_DEV.md        # Гайд по Feature workflow: фазы, агенты, советы
    └── FRONTEND_DESIGN.md    # Гайд по Frontend Design: направления, FSD размещение
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

## Documentation Sync Rule

**При любом изменении или добавлении следующих файлов — автоматически обновить всю связанную документацию:**

| Изменение | Что обновить |
|---|---|
| Добавлен/изменён `.claude/skills/*` | CLAUDE.md (раздел `.claude/ structure`), `AI_TEAM.md` |
| Добавлен/изменён `.claude/agents/*.md` | CLAUDE.md (раздел `.claude/ structure` + таблица команд) |
| Добавлен/изменён `.claude/commands/*.md` | CLAUDE.md (таблица Slash-команд), `AI_TEAM.md` |
| Добавлен/изменён MCP-сервер (`.mcp.json`, `settings.json`) | CLAUDE.md, `AI_TEAM.md`, `FRONTEND_DESIGN.md` если UI-инструмент |
| Изменён стек/зависимости (`package.json`) | CLAUDE.md (раздел Stack & structure), `SPEC.md` |
| Добавлена новая entity/feature/widget | `SPEC.md`, `index.ts` slice (public API) |

**Правило:** не закрывать задачу без проверки, что документация актуальна. Если добавлен скилл — он должен быть в CLAUDE.md. Если добавлен агент — он должен быть в таблице. Синхронизация документации — часть DoD.

## Git rules

- **Никогда не добавлять** `Co-Authored-By:` подпись в commit message.
- **Никогда не делать `git push`** после коммита — только коммит, push делает разработчик вручную.

## Operating contract

При работе над этим репозиторием следуй **`.claude/docs/AI_TEAM.md`** и правилам из **`.claude/rules/`**. Каждый ответ — на русском, код/коммиты/имена — на английском.

**Текущее состояние:** FSD-структура развёрнута, стек установлен (Vue 3 + Pinia + Vue Router + Tailwind CSS v4). Admin-панель и Client-часть реализованы со строгим разделением UI / Logic / Business Rules. API-слой подключён к реальному бэкенду. Проведён полный аудит + исправления: баги, безопасность (Open Redirect), FSD-нарушения (entities/favorite, DishCardPublic удалён), типографика (Plus Jakarta Sans), мобильный UX (touch targets, carousel swipe, checkout bottom bar). Реализована dark/light тема: `entities/theme` (Pinia, localStorage, раздельно для client/admin), `features/theme-toggle` (кнопка в хедерах), `@custom-variant dark` + `.dark` CSS-переменные в `index.css`.

## Workflow (Inbox → Active → Outbox)

Задачи и ТЗ хранятся в `.claude/memory/` (gitignored — только локально):

| Файл | Назначение |
|---|---|
| `inbox.md` | Новые ТЗ и идеи — пиши сюда перед сессией |
| `active.md` | Текущая задача: ТЗ + декомпозиция на блоки + прогресс |
| `outbox.md` | Done-архив: что сделано, коммиты, решения |

**Процесс:** ты пишешь ТЗ в `inbox.md` → Claude переносит в `active.md` и дополняет декомпозицией → выполняет блоки, отмечая `[x]` → по завершению переносит запись в `outbox.md` и очищает `active.md`.

Локальные пути, порты и команды запуска — в `.claude/local.md` (gitignored).

## Commands

### Фронтенд
- `node node_modules/vite/bin/vite.js` — dev-сервер (Node 22 через nvm; полная команда в `.claude/local.md`)
- `npm run build` — type-check (`vue-tsc -b`) + production build в `dist/`
- `npm run preview` — превью production-сборки

> Нет test runner и linter. Ошибки типов — через `vue-tsc` при сборке. Флаги: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `noFallthroughCasesInSwitch`.

### Бэкенд и полный стек
Команды запуска с локальными путями — в **`.claude/local.md`** (gitignored).
Используй `/run-app` для автоматического запуска всего стека.

## Backend connection

- Base URL: `http://localhost:8080/api/v1`
- CORS настроен для `http://localhost:5173`
- API-слой фронта: `src/shared/api/http.ts` (Axios + JWT interceptor)
- Entity API-функции: `src/entities/*/api/*.ts`
- Локальные пути и порты → `.claude/local.md`

## Stack & structure

Vue 3 + TypeScript + Vite + Pinia + Vue Router + Tailwind CSS v4.  
**Шрифты:** `--font-display: "Plus Jakarta Sans"` (заголовки) + `--font-sans: "Nunito"` (body).

```
src/
├── app/              # router, layouts (PublicLayout, AdminLayout), styles/index.css
├── pages/
│   ├── admin/        # admin-страницы + model/useMenuPage.ts
│   ├── account/      # профиль, адреса, заказы, бонусы, промокоды, карты, реферал, уведомления
│   │   └── AccountLayout.vue
│   ├── auth/         # login, register, forgot-password, reset-password
│   ├── cart/         # CartPage.vue — страница корзины (sticky CTA над таб-баром)
│   ├── checkout/     # CheckoutPage.vue, CheckoutSuccessPage.vue
│   ├── favorites/    # FavoritesPage.vue
│   ├── home/
│   │   ├── model/    # useHomePage.ts, menuSections.ts
│   │   └── HomePage.vue
│   ├── orders/       # TrackOrderPage.vue
│   └── search/
│       ├── model/    # useSearchPage.ts — page composable
│       └── SearchPage.vue
├── widgets/
│   ├── public-header/    # PublicHeader + usePublicHeader
│   ├── public-footer/    # PublicFooter + footerNav config
│   ├── account-sidebar/  # AccountSidebar (desktop) + AccountMobileList (master-список) + AccountMobileHeader («Назад» + заголовок); model/nav.ts (ACCOUNT_NAV)
│   ├── cart-drawer/      # CartDrawer (side panel)
│   ├── dish-card/        # DishCardA (client, 4-кол, cart-stepper [−N+]); DishCardAdmin; useDishCard, useImageGallery
│   ├── dish-preview/     # DishPreviewModal + useDishPreview
│   ├── promo-carousel/   # PromoCarousel (image + overlay, autoplay 4s, pause on hover, swipe) — читает entities/banner
│   ├── products-section/ # ProductsSection
│   ├── category-strip/   # CategoryStrip
│   ├── loyalty-banner/   # LoyaltyBanner
│   ├── admin-sidebar/
│   ├── admin-header/
│   ├── mobile-tab-bar/   # MobileTabBar (md:hidden, плавающая пилюля, отступ 20px, только иконки): 4 вкладки (Главная/Поиск/Корзина/Избранное), бейджи cart/favorites, корзина = data-fly-cart-target
│   ├── menu/             # MenuHeader, ProductFilters, CategoryTabs, ProductGrid, EmptyProducts
│   └── dashboard/        # DashboardStats, RecentOrdersTable, OrderStatusBreakdown, TopRestaurants
├── features/
│   ├── auth/             # login, register, forgot, reset-confirm; authRules → shared/lib/validators
│   ├── checkout/         # useCheckout, checkoutDraft, checkoutTotals, deliveryZone; FulfillmentMode (delivery|pickup); FulfillmentToggle (сегментный контрол), PickupSection (выбор точки), AddressSection, PaymentSection, PromoBonusSection, TipSection, OrderSummary
│   ├── edit-profile/     # useProfileForm, profileRules → shared/lib/validators
│   ├── favorite-toggle/  # FavoriteButton.vue (store → entities/favorite)
│   ├── fly-to-cart/      # flyToCart(source, imageUrl) — WAAPI-анимация полёта товара к иконке корзины ([data-fly-cart-target], reduced-motion aware)
│   ├── theme-toggle/     # ThemeToggle.vue (props: area: ThemeArea) — sun/moon icon, store → entities/theme
│   ├── dish-search/      # useSearch
│   ├── address-manager/  # useAddressManager, AddressCard, AddressFormModal
│   ├── card-manager/     # useCardManager, CardItem, CardFormModal
│   ├── order-history/    # useOrderHistory, useReorder, OrderCard, OrderDetailView, OrderFilters
│   ├── order-rating/     # useOrderRating, ratingDraft, RatingModal, StarRating
│   ├── order-tracking/   # useOrderTracking, trackingRules, OrderTrackingView
│   ├── product-form/     # CRUD блюда (admin)
│   ├── menu-filter/      # фильтрация меню admin (useMenuFilter)
│   ├── category-manager/ # CRUD + drag-and-drop сортировка категорий
│   ├── reorder-products/ # drag-and-drop сортировка блюд
│   ├── tag-manager/      # CRUD тегов (admin)
│   ├── banner-manager/   # CRUD + drag-сортировка баннеров (admin): useBannerManager, BannerCard, BannerFormModal
│   └── location-picker/  # выбор города + адрес на карте (Leaflet): useLocationPicker, useLocationMap, locationDraft, LocationPickerModal
├── entities/
│   ├── theme/        # ThemeMode, ThemeArea, useThemeStore — раздельные темы client/admin, localStorage persist, class .dark на <html>
│   ├── favorite/     # useFavoriteStore — localStorage persist (используется из widgets + pages)
│   ├── delivery-location/  # ICity, IDeliveryLocation, CITIES, useDeliveryLocationStore — выбранный город+адрес, localStorage persist
│   ├── branch/       # IBranch, IWorkingHours; useBranchStore (client, fetch+cache activeBranches); useAdminBranchStore (CRUD admin)
│   ├── banner/       # useBannerStore — промо-баннеры: localStorage persist + seed из assets, resolveBannerImage (preset-ключи)
│   ├── dish/         # Product/MenuItem: types, store, api, ui/DishCard
│   ├── category/     # types, store, api
│   ├── tag/          # types, store, api, ui/TagBadge
│   ├── user/         # IUser, useUserStore, authApi
│   ├── cart/         # CartItem, useCartStore
│   ├── order/        # PlacedOrder, useOrderStore, useAdminOrderStore, OrderStatusTimeline
│   ├── address/      # IAddress, useAddressStore, addressApi
│   ├── card/         # ICard, useCardStore, cardApi, cardBrand
│   ├── bonus/        # IBonusEntry, useBonusStore, bonusApi
│   ├── promo/        # IPromoCode, usePromoStore, promoApi, discount
│   ├── referral/     # IReferral, useReferralStore, referralApi
│   └── notification/ # INotification, useNotificationStore, notificationApi
└── shared/
    ├── api/          # http.ts (Axios + JWT interceptor); nominatim.ts (OSM геокодинг: searchPlaces, reverseGeocode)
    ├── lib/
    │   ├── validators.ts  # EMAIL_RE, PHONE_RE, isEmail, isPhone, isIdentifier
    │   ├── money.ts       # formatPrice
    │   ├── date.ts        # formatDateTime
    │   ├── position.ts    # sortByPosition, diffChanged
    │   ├── geo.ts         # pointInPolygon (ray-casting) — определение зоны по координатам
    │   ├── toast.ts       # useToastStore
    │   └── useScrollSpy.ts
    └── ui/
        ├── BackToTop/
        ├── Sortable/         # типизированная обёртка над vuedraggable
        ├── StatsCard/
        ├── Toast/
        └── UnderConstruction/  # виджет-заглушка для страниц "в разработке"
```

> Порядок категорий и блюд хранится в поле `position`; админка меняет его перетаскиванием (`vuedraggable`), стор пересортировывает после fetch — клиент и админка выводят в одном порядке.  
> `useFavoriteStore` живёт в `entities/favorite` — он shared state для widgets (header) и pages (favorites). `features/favorite-toggle` содержит только UI-компонент `FavoriteButton`.
> `useBannerStore` (`entities/banner`) — единый источник промо-баннеров: клиентский `widgets/promo-carousel` показывает `visibleBanners`, админский `features/banner-manager` (страница `/admin/banners`) делает CRUD + drag-сортировку. Персист в localStorage с seed из `src/assets/*.jpeg`; `image` хранит `preset:<id>` или URL, `resolveBannerImage()` резолвит на рендере (устойчиво к ре-хешу ассетов при сборке).
> `useDeliveryLocationStore` (`entities/delivery-location`) — выбранный город+адрес (localStorage persist), точка входа — чип в `widgets/public-header`, открывающий `features/location-picker` (LocationPickerModal). Карта на Leaflet+OSM (как admin zone-editor): фикс. список `CITIES`, поиск/reverse-геокодинг через `shared/api/nominatim`, зона доставки — `pointInPolygon` (`shared/lib/geo`) по полигонам `entities/delivery-zone`. СПб — город по умолчанию (только для него заданы seed-зоны).
> `useThemeStore` (`entities/theme`) — раздельные темы для `client` и `admin` (два ключа в localStorage: `theme:client`, `theme:admin`). Первый визит: `prefers-color-scheme`, далее — сохранённый выбор. Тоггл `.dark` на `<html>` → переопределяет CSS-переменные токенов (`--color-canvas`, `--color-surface`, ...) из `.dark {}` в `index.css`. Переключатель — `features/theme-toggle` (`<ThemeToggle area="client|admin" />`): в `widgets/public-header` и `widgets/admin-header`. `PublicLayout` / `AdminLayout` вызывают `setActiveArea()` в `<script setup>` для анти-FOUC.

### Ключевые архитектурные правила

- **Три слоя:** `model/domainName.ts` (бизнес-правила) → `model/useXxx.ts` (логика) → `ui/*.vue` (только шаблон)
- **Page composable** возвращает `reactive({})` для поддержки `v-model:prop="page.prop"`
- **Страница** вызывает один composable + `onMounted` + компонует виджеты
- SFCs используют `<script setup lang="ts">` — без исключений
- Импорты только через `index.ts` каждого slice (public API)
- TypeScript: `tsconfig.app.json` (src/), `tsconfig.node.json` (vite/tooling)
- Статика из `src/assets/` — через Vite pipeline; `public/` — as-is
