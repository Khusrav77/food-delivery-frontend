# Food Delivery — Frontend

Vue 3 + TypeScript + Vite + Pinia + Tailwind CSS v4.  
Admin panel for managing menu, orders, couriers, and restaurants.

---

## Prerequisites

Make sure you have the following installed:

| Tool | Version | Check |
|---|---|---|
| Node.js | 22.x (via nvm) | `node -v` |
| npm | 10.x+ | `npm -v` |
| Docker Desktop | latest | `docker -v` |
| Java | 21+ | `java -version` |
| Maven Wrapper | bundled with backend | — |
| Git | any | `git -v` |

> **nvm users:** run `nvm use 22` before starting the frontend.

---

## Repository structure

This is the **frontend only**. The backend lives in a separate repository:

```
~/GitProjects/
├── Vue/food-delivery-vue-app/          ← this repo (frontend)
└── Java-Repositories/foo-delivery-backend-app/   ← backend (Spring Boot)
```

Ask the project owner to add you as a collaborator to both repositories.

---

## First-time setup

### 1. Clone both repositories

```bash
# Frontend
git clone git@github.com:Khusrav77/food-delivery-frontend.git ~/GitProjects/Vue/food-delivery-vue-app

# Backend
git clone git@github.com:Khusrav77/food-delivery-backend.git ~/GitProjects/Java-Repositories/foo-delivery-backend-app
```

> SSH clone requires your GitHub SSH key to be configured. Alternatively use HTTPS: replace `git@github.com:Khusrav77/` with `https://github.com/Khusrav77/`.

### 2. Install frontend dependencies

```bash
cd ~/GitProjects/Vue/food-delivery-vue-app
nvm use 22
npm install
```

### 3. Create the environment file

```bash
cp .env.example .env
```

`.env` should contain:

```env
VITE_API_URL=/api/v1
```

The Vite dev server proxies all `/api` requests to `http://localhost:8080` automatically (see `vite.config.ts`).

---

## Running the full stack

Start services in this order: **PostgreSQL → Spring Boot → Vite**.

### Step 1 — PostgreSQL (Docker)

```bash
docker compose -f ~/GitProjects/Java-Repositories/foo-delivery-backend-app/docker/docker-compose.yml up -d
```

- Runs PostgreSQL on **port 5437**
- Database name: `food_delivery_db`

Verify it's up:

```bash
docker ps --filter "publish=5437"
```

### Step 2 — Spring Boot backend

```bash
cd ~/GitProjects/Java-Repositories/foo-delivery-backend-app
./mvnw spring-boot:run
```

- Starts on **port 8080**
- First build downloads dependencies — takes ~2-3 minutes
- Subsequent starts take ~20-30 seconds
- Ready when you see: `Started FooDeliveryBackendApplication`

Verify it's ready:

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/v1/categories
# Expect: 200 or 401
```

### Step 3 — Vite frontend

```bash
cd ~/GitProjects/Vue/food-delivery-vue-app
nvm use 22
node node_modules/vite/bin/vite.js
```

Open: **http://localhost:5173**

---

## Available npm scripts

```bash
npm run dev        # Start Vite dev server (same as the command above)
npm run build      # Type-check + production build → dist/
npm run preview    # Preview production build locally
```

---

## Project structure

```
src/
├── app/          # Router, layouts, global styles, main.ts
├── pages/        # Route-level pages (composition only)
├── widgets/      # Composite UI blocks (AdminSidebar, AdminHeader)
├── features/     # User-facing scenarios (dish-form, category-manager)
├── entities/     # Business entities (dish, category, tag)
└── shared/       # UI kit, HTTP client, utilities, types
```

Architecture: **Feature-Sliced Design v2.1** — layers are strictly top-to-bottom.  
See `.claude/rules/fsd.md` for import rules.

---

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `/api/v1` | API base path (proxied by Vite to port 8080) |

Never expose secrets via `VITE_*` variables — they are bundled into the client build.

---

## Common issues

**Port already in use**
```bash
lsof -ti:5173 | xargs kill   # kill Vite
lsof -ti:8080 | xargs kill   # kill backend
```

**Docker container fails to start**
```bash
docker compose -f ~/GitProjects/Java-Repositories/foo-delivery-backend-app/docker/docker-compose.yml down
docker compose -f ~/GitProjects/Java-Repositories/foo-delivery-backend-app/docker/docker-compose.yml up -d
```

**Node version mismatch**
```bash
nvm install 22
nvm use 22
```

**TypeScript errors**
```bash
npm run build   # vue-tsc runs a full type check
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Language | TypeScript 6 (strict mode) |
| Build tool | Vite 8 |
| State | Pinia |
| Routing | Vue Router 4 |
| Styles | Tailwind CSS v4 |
| HTTP | Axios (instance in `shared/api/http.ts`) |
| Icons | lucide-vue-next |

Backend: Spring Boot 3, PostgreSQL 17, JWT auth.
