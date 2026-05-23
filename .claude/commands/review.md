Run a code review on the current changes or the specified file/feature.

Use the `reviewer` subagent to perform the review following project standards (FSD architecture, Vue 3 best practices, TypeScript strict, production checklist).

If $ARGUMENTS is empty — review all staged/unstaged changes via `git diff`.
If $ARGUMENTS is a file path or feature name — review that specific area.

Steps:
1. Run `git diff HEAD` to see current changes (if no specific target given)
2. Read the relevant files
3. Apply the reviewer agent criteria
4. Output findings grouped by level: 🔴 Blocker → 🟡 Should-fix → 🟢 Nit
5. End with Production Checklist

$ARGUMENTS