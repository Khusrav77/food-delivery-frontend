---
model: inherit
---

Use the `code-debugger` subagent to find and fix the described bug or error.

Bug description or error message: $ARGUMENTS

If $ARGUMENTS is empty — describe the problem before running this command.

The code-debugger will:
1. Ask clarifying questions if the bug is ambiguous (expected vs actual, error message, steps to reproduce)
2. Trace through FSD layers — Component → composable → store → api → http.ts — reading all relevant files before suggesting anything
3. Identify the root cause (not just the symptom) with a specific `file:line` reference
4. Provide the minimal fix with full context — no refactoring, no rewrites
5. Explain how to verify the fix works

If the root cause can't be found — say so explicitly and ask for more context (console log, network tab, TypeScript error).