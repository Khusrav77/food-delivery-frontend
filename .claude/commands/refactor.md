Use the `code-refactorer` subagent to refactor the specified file or feature.

Target (file path or feature name): $ARGUMENTS

If $ARGUMENTS is empty — refactor the file open in the editor.

The code-refactorer will:
1. Read the target file(s) fully before making any changes
2. Grep all usages of the refactored code to know what other files will be affected
3. Identify what violates project standards: `script setup` > 150 lines, direct axios, cross-slice imports, validate/transform logic in composable instead of `model/domain.ts`
4. State clearly what changes will be made and why — in 1-2 sentences before the code
5. Output complete files — no `// ... rest of code`
6. Update all affected imports across the codebase
7. End with: what was extracted, which files were updated, `vue-tsc --noEmit` to verify

**Rule:** Behaviour must not change. No new features, no logic changes.