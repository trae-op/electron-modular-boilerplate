# Main Process Architecture

This document describes the architecture and maintenance guidelines for the Electron main process located in `src/main`.

It is intentionally written as a **practical guide** for how this repository structures main-process code (startup, windows, IPC, storage, services, and feature modules).

## Architecture Goals

- **Feature modularity**: each feature lives in its own folder (`auth/`, `user/`, `updater/`, etc.) and exposes a small surface area to the app entrypoint.
- **Single IPC gateway**: renderer talks to main through a single exposed API (`window.electron`) and two IPC channels (`send`, `invoke`) plus one receive channel (`receive`).
- **Window lifecycle control**: a shared window controller (`@shared/control-window/*`) creates, caches, reuses, and hides windows consistently.
- **Security by default**: IPC handlers validate the sender frame (`@shared/utils.ts`) to reduce the chance of unauthorized IPC calls.
- **Shared infrastructure**: storage, REST API wrapper, menu, tray, notifications, and logging are centralized under `@shared/`.

## Directory Structure

The main process code is organized by feature, with a shared directory for common utilities.

```architecture
src/main/
├── @shared/  # Shared utilities, types, and helpers
│   ├── control-window/ # Window creation/destruction logic
│   ├── ipc/ # IPC gateway registration + helpers
│   ├── menu/ # Application menu configuration
│   ├── services/  # Shared services (e.g., REST API, error handling)
│   ├── tray/ # System tray logic
│   ├── logger.ts # Electron-log wrapper
│   ├── notification.ts # Shared Notification instance
│   ├── path-resolver.ts # Resolve preload/UI/assets paths
│   ├── store.ts # Electron store wrapper
│   └── utils.ts # General utilities (IPC wrappers, env checks)
├── <module>/  # Modules (e.g., auth, user, updater)
│   ├── ipc.ts  # IPC event handlers registration
│   ├── service.ts  # Business logic and external API calls
│   ├── utils.ts # Helper functions of module
│   ├── types.ts  # Feature-specific types
│   └── window.ts  # Window configuration (if applicable)
├── app.ts  # Application entry point
├── config.ts  # Global configuration (URLs, window names)
└── preload.cts  # Context bridge and preload script
```

## Startup Flow (What happens on app launch)

The main process entrypoint is `src/main/app.ts`.

High-level flow:

1. Load environment variables (special handling in production builds).
2. Apply global Electron settings (e.g., hardware acceleration disabled).
3. Configure updater feed (Windows), crash handlers, and global UI infra (tray/menu/notifications).
4. Create the main window using the shared window factory.
5. Register IPC once and dispatch events to feature modules.

### Environment loading

Both `src/main/app.ts` and `src/main/config.ts` load `.env` in production from `process.resourcesPath/.env`. This keeps config available when packaged.

### Global configuration (`config.ts`)

`src/main/config.ts` centralizes:

- window hashes (`windows`)
- folders used by packaging/runtime (`folders`)
- menu labels and icon names
- copy for notifications/errors (`messages`)
- publish metadata and REST API URLs (`publishOptions`, `restApi`)

Feature modules should import constants from `config.ts` instead of hardcoding strings.

## IPC Architecture

### Renderer API surface (`preload.cts`)

The preload script exposes a strict API under `window.electron`:

- `send(payload)` → fire-and-forget events to main (IPC channel: `send`)
- `invoke(payload)` → request/response to main (IPC channel: `invoke`)
- `receive(callback)` → subscribe to main → renderer push messages (IPC channel: `receive`)

This repo uses typed envelopes (see `@shared/ipc/types.ts`) where every message has a `type` and optional `data`.

### Main IPC gateway (`@shared/ipc/ipc.ts`)

Main process listens on exactly two inbound channels:

- `ipcMain.on("send", ...)`
- `ipcMain.handle("invoke", ...)`

And it emits to renderer using a single outbound channel:

- `webContents.send("receive", payload)`

Helpers:

- `sendToRenderer(webContents, payload)`
- `replyToRenderer(event, payload)`

### IPC security: sender validation (`@shared/utils.ts`)

Before dispatching, every inbound IPC message validates the sender frame via `validateEventFrame(event.senderFrame)`.

Rules (simplified):

- In dev, allow `localhost:<LOCALHOST_PORT|LOCALHOST_ELECTRON_SERVER_PORT>`.
- In prod, require `file:` URLs and only accept known window hashes (from `config.ts -> windows`).

When adding new windows/routes, ensure their hash exists in `config.ts -> windows`, otherwise IPC will reject events.

### IPC dispatch pattern in `app.ts`

`src/main/app.ts` registers IPC once and delegates per feature:

- `onSend`: fan-out to feature `handleSend` functions (`auth`, `user`, `app-preload`, `updater`)
- `onInvoke`: delegate to the single invoke handler currently used (`app-version`)

If you add a new feature with IPC, follow the same pattern: export `handleSend` and/or `handleInvoke` from the feature module and register it in `app.ts`.

## Window Architecture

### Window creation (`@shared/control-window/create.ts`)

All windows should be created through `createWindow(...)`. It standardizes:

- preload script location (points to built `dist-main/preload.cjs`)
- dev vs prod URL loading:
  - dev → `http://localhost:<LOCALHOST_PORT>/#<hash>`
  - prod → `loadFile(dist-renderer/index.html, { hash })`
- optional direct `loadURL` (used for OAuth and the preload spinner window)
- basic security defaults:
  - `contextIsolation: true`
  - `nodeIntegration: false`

### Window caching and reuse (`@shared/control-window/cache.ts`, `receive.ts`)

Windows can be cached by `hash`:

- If `isCache: true` and a cached instance exists, `createWindow` reuses it and calls `show()`.
- Cached windows are hidden on close (`event.preventDefault(); window.hide()`), which enables “re-open without re-create”.

Use `getWindow(hash)` to fetch cached windows safely (returns `undefined` if destroyed).

### Global window cleanup (`@shared/control-window/destroy.ts`)

`destroyWindows()` destroys all windows on `before-quit`.

### Content Security Policy

`createWindow` attaches a CSP header (when `isCache` is enabled and not using `loadURL`). It optionally allows connecting to `BASE_REST_API` and allows `unsafe-inline` scripts only in dev.

If you add a window that needs network access, prefer routing those requests through the shared REST API service and keep CSP consistent.

## Storage and Caching

### In-memory store vs persistent storage (`@shared/store.ts`)

This repo uses two storage layers:

- `store` (in-memory `Map`) for runtime references/flags (e.g., update process flag, window references)
- `electron-store` for persistence (auth token, user id, cached API responses)

Key patterns:

- `setStore("updateWindow", window)` stores an in-memory reference.
- `setElectronStorage("authToken", token)` persists auth session.

### REST API wrapper (`@shared/services/rest-api/service.ts`)

The REST API service:

- uses Axios with a request interceptor that injects `Authorization: Bearer <token>` from persistent storage
- returns a consistent `ApiResponse<T>` shape: `{ status, data?, error? }`
- logs out automatically on `401`
- supports response caching into electron-store when `options.isCache` is enabled

### Cache lookup helpers (`@shared/cache-responses.ts`)

`cacheUser(userId)` fetches a cached user response by reconstructing the request URL key.

## Shared UI Infrastructure

- `@shared/menu/*`: defines the default application menu and allows `app.ts` to patch menu entries (e.g., dev tools).
- `@shared/tray/*`: defines the tray menu and tray icon setup; `app.ts` wires click handlers.
- `@shared/notification.ts`: initializes a reusable `Notification` instance.
- `@shared/logger.ts`: configures `electron-log` formatting and levels.
- `@shared/path-resolver.ts`: canonical paths to preload/UI/assets (use when you need to resolve locations reliably across dev/prod).

## Feature Modules (How features are structured)

Each feature typically follows this shape:

- `ipc.ts`: exports `handleSend` and/or `handleInvoke` to integrate with the global IPC gateway
- `service.ts`: business logic and side effects (REST calls, filesystem, OS APIs)
- `window.ts`: window creation + show behavior (optional)
- `types.ts`: feature-specific types (optional)

### app-version

- `app-version/ipc.ts`: exposes `invoke` handler for retrieving the current app version.

### app-preload

- `app-preload/window.ts`: shows a frameless always-on-top spinner window (loads a local `spinner.html`).
- `app-preload/ipc.ts`: initializes the spinner on startup and listens for a `windowClosePreload` event to hide the spinner and show the main window.

### auth

- `auth/window.ts`: opens an auth/OAuth BrowserWindow pointing at the backend auth route.
  - uses a dedicated persistent session partition (`persist:auth`)
- `auth/ipc.ts`:
  - handles `logout` and `checkAuth`
  - opens auth window when renderer requests `windowAuth`
  - listens to `will-redirect` to detect:
    - verify callback → extracts `token` and `userId` → persists them → notifies renderer (`receive` channel)
    - user-exists error → shows dialog

### user

- `user/ipc.ts`: on `user` request, replies with cached user immediately (if present) and then fetches fresh user data.
- `user/service.ts`: fetches the user via the shared REST API wrapper and caches responses.

### updater

Updater has two implementations:

- **Windows** (`updater/services/win/*`) uses `electron-updater`.
  - `setFeedURL.ts` configures GitHub provider and optional token.
  - `controlUpdater.ts` listens for updater events and pushes status to renderer (`sendUpdateInfo`).
- **macOS** (`updater/services/mac/*`) uses GitHub Releases API + manual download.
  - checks latest version, compares versions, downloads `.dmg` to `~/Downloads/app-update/`, reports progress.

Main entry points:

- `updater/window.ts`: creates/shows the update window and triggers update checks.
- `updater/services/checkForUpdates.ts`: orchestrates platform-specific logic.
- `updater/ipc.ts`: handles renderer events (`checkForUpdates`, `restart`, `openLatestVersion`).

### crash

- `crash/service.ts`: sets process and app-level crash handlers:
  - `uncaughtException`
  - `unhandledRejection`
  - `render-process-gone`
    It tears down tray/preload UI and shows an error dialog.

## How to Add a New Main-Process Feature Module

1. Create `src/main/<feature>/`.
2. Add `ipc.ts` exporting `handleSend` and/or `handleInvoke`.
3. Put business logic in `service.ts` (use shared services where possible).
4. If a window is needed, create `window.ts` that calls `createWindow({ hash, isCache: true, options })`.
5. Add any new window hash to `src/main/config.ts -> windows`.
6. Wire the feature into `src/main/app.ts`:
   - add imports
   - include your handler in the `registerIpc({ onSend, onInvoke })` fan-out.
7. If you introduce new IPC message types, update the shared type declarations under the repository `types/` folder so `preload.cts` and renderer stay type-safe.

## Testing Notes

Main-process unit tests are co-located next to implementation files (e.g., `create.test.ts`). When writing new tests, mock Electron APIs (`ipcMain`, `BrowserWindow`, etc.) and focus on pure logic + IPC handler behavior.
