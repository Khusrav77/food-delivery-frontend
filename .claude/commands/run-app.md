---
model: haiku
---

Start the full stack: PostgreSQL → Spring Boot backend → Vite frontend.

$ARGUMENTS

Follow these steps in order:

## Step 1 — PostgreSQL
Check if Postgres is already running on port 5437:
```bash
docker ps --filter "publish=5437" --format "{{.Names}}"
```
If not running, start it:
```bash
docker compose -f ~/GitProjects/Java-Repositories/foo-delivery-backend-app/docker/docker-compose.yml up -d
```

## Step 2 — Spring Boot backend
Check if something is already listening on port 8080:
```bash
lsof -ti:8080
```
If port is free, start the backend in the background (it takes ~20-30 seconds to boot):
```bash
cd ~/GitProjects/Java-Repositories/foo-delivery-backend-app && ./mvnw spring-boot:run
```
Run this command in the background. Then wait for the backend to be ready by polling:
```bash
until curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/v1/categories | grep -q "200\|401"; do sleep 3; done
```

## Step 3 — Vite frontend
Check if something is already on port 5173:
```bash
lsof -ti:5173
```
If port is free, start Vite in the background:
```bash
cd ~/GitProjects/Vue/food-delivery-vue-app && node node_modules/vite/bin/vite.js
```

## Step 4 — Report status
After all three are running, report:
- PostgreSQL: port 5437 ✓/✗
- Backend: http://localhost:8080 ✓/✗
- Frontend: http://localhost:5173 ✓/✗

If a service is already running on its port — report it as already running, don't restart it.