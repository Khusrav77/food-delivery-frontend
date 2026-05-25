Use the `code-test-writer` subagent to write tests for the specified file or feature.

Target (file path, composable name, or feature): $ARGUMENTS

If $ARGUMENTS is empty — write tests for the file open in the editor.

The code-test-writer will:
1. Read the target file fully to understand its public API and possible states
2. Prioritise: pure functions in `model/domain.ts` → composables → Pinia stores → Vue components
3. Write Vitest + Vue Test Utils tests following the AAA pattern (Arrange / Act / Assert)
4. Cover: happy path, edge cases, error states, empty states
5. Place test files next to the tested code (`model/__tests__/useXxx.spec.ts`)
6. Mock only at system boundaries — HTTP (axios), localStorage, router. Never mock Pinia stores or composables directly
7. Briefly explain what each `describe` block covers and why it matters for the business logic