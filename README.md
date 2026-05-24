# track-svc-memo-ui

Frontend for the LifeMemo application — a React + Vite SPA that handles user authentication (register, login, logout, password reset) and routes authenticated users to the dashboard.

---

## Requirements

| Tool | Minimum version | Notes |
|------|----------------|-------|
| Node | 20.x | Vite 8 requires Node ≥ 20 |
| npm  | 10.x | Comes bundled with Node 20+ |
| Vite | 8.x | Installed via `npm install` |

Developed and tested on Node 22 / npm 10.

---

## Getting started

```bash
npm install
```

---

## Running in development

```bash
npm run dev
```

Starts the Vite dev server (default: `http://localhost:5173`) with Hot Module Replacement enabled.

The dev server proxies all `/auth/*` requests to `http://localhost:8081`, so you need the backend (`track-svc-memo`) running locally on port 8081. No extra environment variables are needed for dev — leave `VITE_API_URL` unset.

---

## Building for production

```bash
npm run build
```

Output is written to `dist/`. Before building, set the backend URL:

```bash
VITE_API_URL=https://api.yourdomain.com/auth npm run build
```

This env var is inlined at build time by Vite. If it is not set, the app falls back to the `/auth` proxy path (only useful when served behind a reverse proxy that forwards `/auth` to the backend).

To preview the production build locally:

```bash
npm run preview
```

---

## Project structure and components

```
src/
├── main.jsx                  # Entry point — mounts <App /> into #root
├── App.jsx                   # Router setup and top-level route definitions
├── api/
│   └── auth.js               # Axios client + all auth API calls
├── context/
│   └── AuthContext.jsx       # Global auth state (token, user, login/logout)
├── components/
│   └── ProtectedRoute.jsx    # Route guard — redirects to /login if not authenticated
└── pages/
    ├── LoginPage.jsx         # /login
    ├── RegisterPage.jsx      # /register
    ├── ForgotPasswordPage.jsx# /forgot-password
    ├── ResetPasswordPage.jsx # /reset-password
    └── DashboardPage.jsx     # /dashboard (protected)
```

### Component relationships

```
main.jsx
  └── App.jsx  (BrowserRouter)
        └── AuthProvider  (wraps all routes, provides auth context)
              ├── /login              → LoginPage  (+toast on redirect from register/reset)
              ├── /register           → RegisterPage
              ├── /forgot-password    → ForgotPasswordPage
              ├── /reset-password     → ResetPasswordPage
              ├── /dashboard          → ProtectedRoute → DashboardPage
              └── *                  → redirect to /login
```

**`api/auth.js`** — The axios instance used by every component that talks to the backend. It automatically:
- Attaches the `Bearer` access token from `sessionStorage` to every request.
- On a `401` response, silently attempts one token refresh via `/auth/refresh` (uses the `HttpOnly` refresh-token cookie), then retries the original request. If the refresh also fails, it clears the stored token.

**`AuthContext`** — Holds `user`, `accessToken`, and `isAuthenticated` state. Exposes `login`, `register`, and `logout` actions. The access token is persisted in `sessionStorage` so it survives page reloads within the same tab but is cleared when the tab closes.

**`ProtectedRoute`** — Wraps any route that requires authentication. If `isAuthenticated` is false it redirects to `/login`, preserving the originally requested location so the user is sent back after a successful login.

**Pages** — Each page is a self-contained form built with `react-hook-form` and MUI components. Pages call `AuthContext` actions or `authApi` directly and navigate programmatically on success.

---

## Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the `dist/` build locally |
| `npm run lint` | Run ESLint |
