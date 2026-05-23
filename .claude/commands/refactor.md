Use the `refactorer` subagent to refactor the specified file or feature.

Target (file path or feature name): $ARGUMENTS

If $ARGUMENTS is empty — read the file open in the editor and refactor it.

The refactorer will:
1. Read the target file(s) fully before making any changes
2. Identify what violates project standards (script setup > 150 lines, direct axios, cross-slice imports, etc.)
3. State clearly what changes will be made and why
4. Output complete files — no "// ... rest of code"
5. Verify behaviour is unchanged after refactoring