Use the `doc-writer` subagent to write or update documentation.

Target (file, feature, or "spec" to update SPEC.md): $ARGUMENTS

If $ARGUMENTS is empty — document the file open in the editor.

The doc-writer will:
1. Read the target file(s) fully
2. Determine what needs documentation: public API functions, composable return types, new endpoints in SPEC.md
3. Write concise JSDoc only where the WHY is non-obvious — not for self-evident code
4. Update .claude/docs/SPEC.md if new endpoints or DB tables were added
5. Keep index.ts exports described with one-line comments