Use the `code-doc-writer` subagent to write or update documentation.

Target (file, feature, or "spec" to update SPEC.md): $ARGUMENTS

If $ARGUMENTS is empty — document the file open in the editor.

The code-doc-writer will:
1. Read the target file(s) fully before writing anything — never document from memory
2. Read existing docs (SPEC.md, JSDoc) to avoid duplicates and contradictions
3. Determine what actually needs documentation: public API functions, composable return types, new endpoints
4. Write concise JSDoc only where the WHY is non-obvious — not for self-evident code
5. Update `.claude/docs/SPEC.md` if new endpoints or DB tables were added
6. Keep `index.ts` exports described with one-line comments

**Rule:** Outdated documentation is worse than none. Update, don't add on top of stale content.