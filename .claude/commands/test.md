Use the `test-writer` subagent to write tests for the specified file or feature.

Target (file path, composable name, or feature): $ARGUMENTS

If $ARGUMENTS is empty — write tests for the file open in the editor.

The test-writer will:
1. Read the target file to understand what needs testing
2. Identify the most critical behaviours to cover (per DoD: smoke tests for critical features)
3. Write Vitest + Vue Test Utils tests
4. Place test files next to the tested code (*.spec.ts)
5. Mock only at system boundaries (HTTP, localStorage, router) — not internal stores