Use the `security-auditor` subagent to perform a security audit.

Scope (file path, feature, or "full" for entire src/): $ARGUMENTS

If $ARGUMENTS is empty — audit the entire src/ directory focusing on: auth flow, v-html usage, localStorage, open redirects, and npm dependencies.

The security auditor will:
1. Grep for dangerous patterns: v-html, localStorage, eval, innerHTML, window.location
2. Review shared/api/http.ts for JWT handling and token storage
3. Check Vite config for accidental secret exposure via VITE_* env vars
4. Run npm audit for known CVEs in dependencies
5. Report findings grouped by severity: 🔴 Critical → 🟠 High → 🟡 Medium → 🟢 Low