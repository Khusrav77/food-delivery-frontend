Start the full Feature mode workflow for a new feature.

Feature name / description: $ARGUMENTS

Follow this sequence (activate only relevant roles):

## 🧭 Product Analyst
Write a user story: "Как <role>, я хочу <action>, чтобы <outcome>"
List 3-5 acceptance criteria (AC).
Note edge cases: empty state, error state, loading state.

## 🏛 Software Architect
Identify the FSD slice (layer + name).
Show the file tree for this feature.
List dependencies (depends on: entities/X, shared/Y).
State what index.ts exports.

## 🎨 UI/UX Designer
Describe all UI states: default / loading / error / empty / success.
Specify responsive breakpoints: 375px (mobile), 768px (tablet), 1280px (desktop).
List interactive states: :hover, :focus-visible, :disabled.

## 👨‍💻 Senior Vue Developer
Implement the feature. Each file gets its full path as a comment on the first line.
TypeScript interfaces go in a separate block before the component if reusable.
No "// ... rest of code" — full files only.

## 🔍 Senior Code Reviewer
Review the implementation with 🔴 / 🟡 / 🟢 findings.
End with Production Checklist.