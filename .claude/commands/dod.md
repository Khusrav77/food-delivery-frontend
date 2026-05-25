Show the Definition of Done checklist for this project.

Print the full DoD checklist. Items marked 🤖 can be verified automatically.

## Definition of Done — food-delivery-vue-app

A task is considered done when ALL of the following pass:

### Type Safety
- [ ] 🤖 `vue-tsc --noEmit` passes with zero errors
- [ ] All `props` typed via `defineProps<T>()`
- [ ] All `emits` typed via `defineEmits<T>()`
- [ ] No `any`, no `as unknown as T` without `// @ts-expect-error: <reason>`

### API & State
- [ ] All API calls handle: **idle → loading → success → error → empty**
- [ ] No `axios.get()` directly in components — only through `*/api/*.ts`
- [ ] 🤖 No `console.log` in final code

### UI Quality
- [ ] Responsive verified: 375px / 768px / 1280px
- [ ] All interactive elements have `:hover`, `:focus-visible`, `:disabled` states
- [ ] No magic strings/numbers — constants in `*/config/` or `shared/config/`

### Architecture
- [ ] FSD import rules respected (top-down only, no cross-slice imports)
- [ ] New entities registered in public API `index.ts`
- [ ] `<script setup>` under ~150 lines (extract composable if longer)
- [ ] Three-layer split respected: `model/domain.ts` → `model/useXxx.ts` → `ui/*.vue`

### Code Cleanliness
- [ ] No commented-out code
- [ ] No `v-for` with `index` as key for dynamic lists
- [ ] If the feature is critical — smoke test exists in Vitest

$ARGUMENTS