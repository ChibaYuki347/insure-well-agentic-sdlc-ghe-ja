# InsureWell Implementation Notes

## F1: User Login and Session Management

### What was implemented

**Backend (Spring Boot)**
- Added `spring-boot-starter-security` and `jjwt` 0.12.6 dependencies.
- `User` entity (`id`, `username`, `password`, `role`) persisted to H2 `users` table.
- `UserRepository` with `findByUsername` query.
- `JwtUtil` — generates and validates HS256-signed JWT tokens (24-hour expiry). Secret and expiry are externalized to `application.properties`.
- `JwtAuthenticationFilter` — `OncePerRequestFilter` that extracts `Authorization: Bearer <jwt> header, validates the JWT, and sets the `SecurityContextHolder` principal.
- `SecurityConfig` — configures Spring Security (stateless sessions, CSRF disabled, CORS permissive for dev):
  - Public routes: `POST /api/auth/**`, `GET /api/health`, `/h2-console/**`, pre-flight OPTIONS.
  - All other `/api/**` routes require a valid JWT (`401` via custom `AuthenticationEntryPoint`).
- `AuthController` — `POST /api/auth/login` accepts `{ username, password }` JSON and returns `{ token, username, role }`. Returns generic `401` on bad credentials (no detail that reveals whether username or password was wrong).
- `DataConfig` updated to seed two demo users on startup: `admin/admin123` (ADMIN) and `user/user123` (USER).

**Frontend (React)**
- `AuthContext.js` — React context providing `{ token, user, isAuthenticated, login, logout }`. Token and user metadata persisted to `localStorage` (`insurewell_token`, `insurewell_user`).
- `Login.js` — Login form component with username/password inputs, loading state, and friendly Japanese error messages (does not echo attempted credentials).
- `Login.css` — Styles for the login card.
- `App.js` updated to:
  - Wrap the app with `AuthProvider`.
  - Show `<Login />` when not authenticated.
  - Add an Axios request interceptor that attaches `Authorization: Bearer <jwt> header to every API call.
  - Handle `401` responses from the backend by calling `logout()`.
- `Navigation.js` updated to accept `onLogout` prop and render a **サインアウト** button that clears the session.
- `Navigation.css` updated with logout button hover styles.

**Playwright Tests**
- `playwright.config.ts` updated to add a `setup` project that logs in once and saves `storageState` to `playwright/.auth/user.json`. All existing tests depend on this project and use the saved auth state automatically.
- `playwright/.auth/` added to `.gitignore`.
- `tests/auth.setup.ts` — global setup that authenticates once before all test runs.
- `tests/auth.spec.ts` — auth-specific E2E tests covering:
  - Login page renders when unauthenticated.
  - Error shown on invalid credentials.
  - Error message does not echo the attempted password.
  - Successful login shows dashboard.
  - Sign-out returns to login page.

### Deviations from HLD

- The HLD listed authentication as "Out of scope" for the baseline. This implementation adds F1 (P1) as required by the issue. The HLD's security section noted this as a future-phase requirement.
- CSRF protection is disabled (stateless JWT). For a production deployment, consider CSRF for any cookie-based session flows.
- JWT secret is in `application.properties` for local development. In production, this should be supplied via an environment variable or secrets manager.

### Demo Credentials

| Username | Password  | Role  |
|----------|-----------|-------|
| admin    | admin123  | ADMIN |
| user     | user123   | USER  |
