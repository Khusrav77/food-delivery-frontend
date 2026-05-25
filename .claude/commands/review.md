Use the `code-reviewer` subagent to perform a code review.

Target (file path, feature, or empty for current diff): $ARGUMENTS

If $ARGUMENTS is empty — review all staged/unstaged changes via `git diff HEAD`.
If $ARGUMENTS is a file path or feature name — review that specific area.

The code-reviewer will:
1. Run `git diff HEAD` or read specified files
2. Apply confidence scoring — only report issues with confidence ≥ 80 (verified, not theoretical)
3. Check FSD compliance: import direction, cross-slice, internal paths bypassing `index.ts`
4. Check TypeScript: untyped props/emits, `any`, missing return types
5. Check Vue 3 patterns: `script setup` length, business logic in template, `v-for` keys
6. Check API states: idle / loading / success / error / empty
7. Output findings grouped: 🔴 Blocker → 🟡 Should-fix → 🟢 Nit
8. End with Production Checklist

$ARGUMENTS