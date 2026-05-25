Use the `code-architect` subagent to answer an architecture question or design a new module.

Question or feature to design: $ARGUMENTS

If $ARGUMENTS is empty — answer for the file open in the editor.

The code-architect will:
1. Explore existing similar features in the codebase to find patterns to follow
2. Identify the correct FSD layer and slice name
3. Show the full file tree for the module (with three layers: domain/logic/ui)
4. List dependencies (depends on: entities/X, shared/Y)
5. Define what index.ts exports (public API)
6. Provide data flow: entry point → composable → store → api → http.ts
7. Give a phased build sequence as a checklist (shared → entities → features → widgets → pages)
8. Explain why this structure — not just what
