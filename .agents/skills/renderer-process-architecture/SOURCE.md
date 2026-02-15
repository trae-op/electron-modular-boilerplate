# Renderer Process Architecture

This document is a practical guide to the renderer architecture implemented in `src/renderer`.

The renderer is a React app running inside Electron’s renderer process. It uses:

- **React + React Router** (hash routing)
- **Tailwind CSS** (dark mode via the `dark` class)
- **IPC via `window.electron`** (provided by the preload script)
- **Domain modules (“conceptions”)** that encapsulate state + IPC + UI

## 1. Source Layout (What lives where)

The renderer is organized around **three layers**:

1. **Windows (Routes)**: page-level entry points under `windows/`.
2. **Domains (Conceptions)**: feature modules under `conceptions/`.
3. **Shared UI/Infra**: reusable UI primitives and cross-cutting composites/hooks.

Current structure (representative, omitting some barrel files):

```architecture
src/renderer/
├── App.tsx                 # App shell: providers + router + routes
├── main.tsx                # React root
├── index.css               # Tailwind base layer + global styles
├── assets/                 # Renderer-only assets (e.g. react.svg)
├── components/             # Shared UI primitives
│   ├── Button/
│   ├── IconButton/
│   ├── Avatar/
│   ├── AvatarButton/
│   ├── List/
│   ├── LoadingSpinner/
│   └── Popover/
├── composites/             # Cross-cutting feature blocks
│   ├── Routes/             # Public/Private route guards
│   ├── LightDarkMode/      # Theme state + toggle
│   ├── AppVersion/         # App version (IPC invoke)
│   └── AllowedRoutes/      # Conditional render based on current route
├── conceptions/            # Domain modules (feature “packages”)
│   ├── Auth/               # Auth state + auth IPC + SignIn UI
│   ├── User/               # User state + user IPC + user popover
│   └── Updater/            # Update state + update IPC + updater UI
├── layouts/                # Layout wrappers used by routes
│   ├── Main.tsx
│   └── TopPanel.tsx
├── hooks/                  # General hooks (not domain-specific)
│   ├── closePreloadWindow/
│   └── dayjs/
├── utils/                  # Small pure helpers
│   └── date.ts
├── config/                 # Renderer config/constants
│   └── config.ts
└── test/                   # Renderer test setup only
        └── setup.ts
```

## 2. Entrypoints

### `main.tsx`

- Imports global Tailwind styles from `index.css`.
- Creates the React root and renders `<App />` inside `<StrictMode>`.

### `App.tsx`

`App.tsx` defines **the application shell**:

- Wraps the app with providers:
  - `ProviderAuth` (Auth domain provider + IPC bootstrap)
  - `ProviderLightDarkMode` (theme provider)
- Sets up **hash routing** with `<HashRouter>`.
- Uses `React.lazy` + `<Suspense>` with the shared `LoadingSpinner` fallback.
- Declares the routes under a single layout (`MainLayout`).

Routes currently implemented:

- `/sign-in` (public)
- `/window:main` (private)
- `/window:update-app` (not gated)

Important: these paths intentionally resemble Electron window hashes (e.g. `window:main`).

## 3. Routing & Guards

Routing is implemented with `react-router-dom` and small guard components:

- `composites/Routes/components/Routes.tsx`
  - `PublicRoute`: redirects authenticated users to `/window:main`
  - `PrivateRoute`: redirects unauthenticated users to `/sign-in`

Auth state comes from `useAuthenticatedSelector()` (Auth context selector).

## 4. Layouts

### `layouts/Main.tsx` (`MainLayout`)

Responsibilities:

- Provides app-level page layout and spacing.
- Applies light/dark background and text colors based on `usePaletteModeSelector()`.
- Calls `useClosePreloadWindow("sign-in")` to ask main process to close the preload/spinner window when the user reaches the `/sign-in` route.

### `layouts/TopPanel.tsx`

A simple reusable flex container for “top bar” content, used by the Home window.

## 5. Windows (Page-level Routes)

Windows are the route entry points. They are intentionally thin: they mostly **compose domain providers and domain components**.

### `windows/logIn/LogIn.tsx`

- Renders the Auth domain UI (`<SignIn />`).

### `windows/home/Home.tsx`

- Calls `useClosePreloadWindow("window:main")` to close the preload window when the main window route is shown.
- Composes domain providers:
  - `ProviderUpdater` + `UpdateSubscriber` (so update status is available)
  - `ProviderUser` (so user data is available)
- Lazy-loads the Home top panel.

### `windows/home/TopPanel.tsx`

Implements the fixed top bar:

- `AppVersion` composite (shows app icon + version fetched via IPC invoke)
- Light/Dark toggle
- User popover menu
  - Includes an “Update” action when update status indicates a downloaded update
  - Includes a “Logout” action

### `windows/updater/Updater.tsx`

- Shows the dedicated update window UI.
- Wraps `<Window />` from the Updater domain with `ProviderUpdater`.

## 6. IPC Integration (Renderer ↔ Main)

Renderer code uses the **preload-exposed** API `window.electron`:

- `window.electron.send({ type, data? })` (fire-and-forget)
- `window.electron.invoke({ type, data? })` (request/response)
- `window.electron.receive((payload) => { ... })` (subscribe to pushed events)

Renderer IPC patterns in this repo:

### 6.1 “Bootstrap request + receive updates” (send + receive)

Used by domain modules:

- **Auth**

  - On mount: sends `{ type: "checkAuth" }`
  - On receive: listens for `{ type: "auth", data: { isAuthenticated } }` and updates Auth context.

- **User**

  - On mount: sends `{ type: "user" }`
  - On receive: listens for `{ type: "user", data: { user } }` and updates User context.

- **Updater**
  - On mount: sends `{ type: "checkForUpdates" }`
  - On receive: listens for `{ type: "updateApp", data: { status, message, downloadedPercent, version, platform, updateFile } }` and updates Updater context.

### 6.2 “One-shot request” (invoke)

Used by `composites/AppVersion`:

- Calls `window.electron.invoke({ type: "getVersion" })` and renders the version when loaded.

## 7. Domain Modules (“Conceptions”)

Each domain lives under `conceptions/<Domain>/` and typically contains:

- `context/`: domain state container
- `hooks/`: domain logic (including IPC subscription hooks)
- `components/`: domain UI
- `index.ts`: public exports (barrel)

### 7.1 Context pattern: subscription store + selectors

Domains implement context as a tiny external-store-like container:

- State is stored in `useRef` (not `useState`).
- A `subscribers` set is maintained.
- “Getters” return the current value.
- “Setters” update the ref and notify subscribers.
- Selectors use `useSyncExternalStore(subscribe, getSnapshot)`.

This keeps updates predictable and avoids unnecessary rerenders.

Domains currently implemented:

- **Auth**: `isAuthenticated` boolean, plus IPC bootstrap container (`ProviderAuth`).
- **User**: `user` object, fetched via IPC.
- **Updater**: update state (`status`, `message`, progress, platform metadata).

### 7.2 Recommended provider style

Providers should be composed like Auth does:

- a pure state Provider (`context/Context.tsx`)
- an IPC “bootstrap” wrapper that:
  - sends initial request on mount
  - subscribes to main-process push events via `receive`
  - writes results into context using dispatch hooks

## 8. Composites (Cross-cutting blocks)

Composites are reusable “feature blocks” that are not domain-specific:

- **LightDarkMode**

  - Stores palette mode (`light` | `dark`) in localStorage
  - Updates DOM:
    - `documentElement.dataset.paletteMode`
    - `documentElement.classList.toggle("dark")`
    - `documentElement.style.colorScheme`
  - Exposes:
    - `ProviderLightDarkMode`
    - `usePaletteModeSelector()`
    - `useTogglePaletteMode()`
    - `Toggle` button component

- **Routes**

  - `PublicRoute` / `PrivateRoute` guards

- **AppVersion**

  - Displays app icon and version (from IPC invoke)

- **AllowedRoutes**
  - A conditional render helper: only renders children if the current pathname matches an allowed set.
  - Uses a shared `TRoutes` union (`sign-in` | `window:main` | `window:update-app`).

## 9. Shared UI Components

Shared UI primitives are built to be composable and theme-aware:

- Tailwind classes include both light and `dark:` variants.
- Components accept `className` to allow overrides.
- Most components are wrapped with `memo`.

Notable primitives:

- `Button`: color + variant styling (`contained` | `outlined` | `text`).
- `IconButton`: round icon button with optional numeric sizing.
- `Popover`: portal-based popover anchored to an element; closes on outside click + Escape.
- `LoadingSpinner`: full-screen overlay; used as Suspense fallback.
- `List`: generic list renderer used for menus.
- `Avatar` / `AvatarButton`: user identity rendering and a button wrapper.

## 10. Global Styling

`index.css` defines Tailwind layers and a small base style layer.

- Dark mode is activated by adding `dark` to the root element.
- Global body and root min-height are enforced.

## 11. General Hooks & Utilities

- `hooks/closePreloadWindow/useClosePreloadWindow.ts`

  - Watches the current route; when it matches the target pathname, sends `{ type: "windowClosePreload" }` to main.

- `hooks/dayjs/useDayjs.ts`

  - Lazily imports `dayjs` once and caches it.

- `utils/date.ts`
  - Pure date formatting helpers for ISO input.

## 12. Testing (Renderer)

Unit tests are configured with Testing Library and Jest DOM via `test/setup.ts`.

Guideline used in this repo: prefer selecting elements by `data-testid` when asserting values/text.

## 13. How to Extend This Architecture

### 13.1 Add a new Window (route)

1. Create `src/renderer/windows/<name>/<Name>.tsx` as a thin composition layer.
2. Lazy import it in `App.tsx`.
3. Add a `<Route path="/..." element={<Lazy... />} />` under `MainLayout`.
4. If this window corresponds to a new Electron window hash, ensure the **main process** knows it (hash must be allowed/registered in main config).

### 13.2 Add a new Domain (conception)

1. Create `src/renderer/conceptions/<Domain>/`.
2. Implement `context/` using the subscription pattern:
   - `Context.tsx` (refs + getters/setters + subscribe)
   - `useContext.ts` (throws if missing provider)
   - `useSelectors.ts` (selectors + dispatch hooks)
   - `types.ts`
3. Put renderer↔main integration in `hooks/useIpc.ts` (or similar).
4. Put UI in `components/`.
5. Export a clean surface from `index.ts`.

### 13.3 Add a new IPC flow

1. Add a new message `type` to the shared types (see repository `types/`).
2. Implement the main-process handler for that message.
3. In the renderer, follow one of the existing patterns:
   - **send + receive** for subscription-like updates
   - **invoke** for request/response
