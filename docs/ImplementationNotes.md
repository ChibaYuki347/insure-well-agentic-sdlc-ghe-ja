# Implementation Notes

## 2026-06-22

### Implemented slice
- Added session-based authentication with Spring Security.
- Added seeded local users for admin and policyholder roles.
- Protected policy and claim APIs behind authentication.
- Added initial RBAC rules for admin vs policyholder behavior.
- Added React login/logout flow and role-aware UI gating.

### Approved deviations and interim decisions
- Ownership is currently inferred from `Policy.holderName` matching the authenticated user's `fullName`.
- This is sufficient for the workshop MVP, but it is not the desired long-term ownership model.
- The first authenticated release uses local JPA/H2 users instead of external identity federation.
- CSRF is disabled for the workshop-local session flow to reduce setup complexity.

### Follow-up work
- Replace holder-name ownership matching with an explicit user-to-policy relationship.
- Introduce a separate adjuster role if claims operations need to diverge from admin.
- Add global error envelope handling across all controllers.
- Revisit CSRF and session hardening before non-local deployment.

### Runtime and E2E notes
- Spring Security path rules were switched to explicit `AntPathRequestMatcher` entries to avoid startup ambiguity when both DispatcherServlet and H2 console servlet are present.
- Playwright tests now authenticate via the real login form (`/api/auth/login`) before dashboard/claims assertions.
- Validation-related E2E checks were aligned with current browser-native required-field behavior in forms.

### CI integration notes
- `pipelines/frontend.yml` now includes a Playwright E2E stage that starts backend and frontend in the same job, waits for readiness, and runs `npx playwright test`.
- The frontend PR pipeline now triggers on both `src/frontend/**` and `src/backend/**` so API/auth changes are validated by E2E.
- CI publishes Playwright HTML report, raw `test-results`, and startup logs (`_tmp/backend-ci.log`, `_tmp/frontend-ci.log`) as pipeline artifacts.