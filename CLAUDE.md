# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See also the root `../CLAUDE.md` for monorepo-wide context (backend, scripts, CI/CD).

## Commands

```bash
yarn start              # Dev server on port 3000
yarn build              # Production build
yarn test               # Jest tests (watch mode)
yarn test --watchAll=false  # Jest tests (single run)
yarn lint               # ESLint check
yarn lint:fix           # Auto-fix lint issues
yarn format             # Prettier formatting
```

To regenerate the API client from backend OpenAPI: `../scripts/generar-contrato-be-en-fe.sh`

## Architecture

### App Structure
- `src/app.tsx` — Root component: sets up QueryClientProvider, AppContextProvider, HashRouter, and route definitions
- `src/rutas.ts` — Route path constants (RAIZ, CARPETAS_HOME, ESCRITOS_HOME, VER_ESCRITO, etc.)
- `src/pantallas/encuadre.tsx` — Layout wrapper for authenticated pages (renders `<Outlet />`)

### State Management
- **Zustand** (`src/hooks/use-auth.ts`) — Auth store with persisted JWT token, login/logout, role checking. Uses `zustand/middleware/persist` to survive page reloads
- **React Context** (`src/app-context.tsx`) — Tracks `fechaHoraQueIngresoElPassword` for password re-validation flow
- **TanStack React Query** — All server data fetching and mutations

### API Layer
- `src/api/clients.ts` — **Auto-generated, do not edit**. TypeScript client generated from backend OpenAPI spec
- `src/api/api.ts` — Exports singleton `api` instance (Client + HttpClientWrapper)
- `src/api/http-client-wrapper.ts` — Custom fetch wrapper that injects JWT Bearer token from Zustand store (not from React context), handles 401/403 by logging out and redirecting
- `src/api/custom-hooks/use-api-query.tsx` — Wraps `useQuery` with Spanish-named props (`fn`, `key`, `activado`, `transformarResultado`)
- `src/api/custom-hooks/use-api-mutation.tsx` — Wraps `useMutation` with toast notifications on success/error (`mensajeDeExito`, `antesDeMensajeExito`, `despuesDeExito`)

### Auth Flow
1. Login screen calls `useAuth.login()` which hits `api.login()` and stores JWT
2. `RequiereAutenticacion` wrapper redirects to `/login` if not authenticated
3. `RequierePassword` + `AppContext` handle password re-validation for sensitive actions
4. `HttpClientWrapper` auto-attaches Bearer token to non-public routes, auto-logouts on 401/403

### Key Patterns
- Screens live in `src/pantallas/` with subdirectories per domain (carpetas, escritos, login, modo-lectura, tacho)
- Reusable UI components in `src/components/ui/`
- Drag & drop via `@dnd-kit` for reordering carpetas and moving escritos between carpetas
- Toasts via `sonner` (used directly and through `useApiMutation`)
- `@` import alias maps to `src/` (configured in `craco.config.js` and `tsconfig.json`)

## Code Conventions

- All code, variable names, UI text, and comments in **Spanish**
- Tabs (4-space width), double quotes, semicolons required
- Components: PascalCase filenames; hooks: `use-` prefix kebab-case; utilities: kebab-case
- camelCase for functions and variables, UPPER_SNAKE_CASE for constants
