# @devisfuture/electron-modular — Skill Source

Use this source when implementing or refactoring Electron main-process architecture with `@devisfuture/electron-modular`.

## What the package provides

- Decorator-based DI and module composition for Electron main process.
- Module boundaries via `@RgModule` with `imports`, `providers`, `ipc`, `windows`, `exports`, and optional `lazy` config.
- Centralized IPC setup via `@IpcHandler` classes.
- Window lifecycle management via `@WindowManager` classes.
- Strong typing support across module contracts and window hashes.

## Core setup

### 1) Initialize settings early

Use `initSettings` with:

- `localhostPort`
- `folders.distRenderer`
- `folders.distMain`
- optional `cspConnectSources`

`distMain` is used to resolve default preload output (`preload.cjs`) unless a window overrides it.

### 2) Bootstrap modules on app ready

- Call `bootstrapModules([...])` inside `app.on("ready", async () => {})`.
- Keep startup modules eager unless there is clear benefit to defer.

## Module architecture rules

### Standard module shape

Recommended folder layout:

- `module.ts`
- `service.ts` (or `services/*`)
- `ipc.ts` (or multiple IPC files)
- `window.ts` (if UI window exists)
- `tokens.ts` + `types.ts` for provider contracts

### Two dependency patterns

1. **Direct service injection**
   - Use when full service access is needed and dependencies are simple.

2. **Provider pattern with token + factory**
   - Use for cross-module boundaries and limited interfaces.
   - Prefer `provide` + `useFactory` + explicit `inject` list.
   - Export only what downstream modules need.

### Cross-module dependency guidance

- Prefer tokens for cross-module contracts.
- Keep services single-responsibility.
- Preserve clear ownership: module exports should be minimal.

## IPC guidance

- Register handlers in classes decorated with `@IpcHandler()`.
- Implement `onInit` to wire channels.
- Use `getWindow("window:...")` from `TParamOnInit` when handlers need window access.
- Keep IPC thin; delegate business logic to services.

## Window manager guidance

- Use `@WindowManager<TWindows["key"]>({...})` with:
  - unique `hash`
  - `options` (`BrowserWindow` config)
  - optional `isCache`

- Lifecycle naming conventions:
  - `onFocus`, `onClose`, etc. for BrowserWindow events
  - `onWebContentsDidFinishLoad`, etc. for webContents events

- Event mapping convention:
  - Prefix removed (`on`, `onWebContents`), then camelCase → kebab-case event.

- Handler args:
  - 0–1 params: receives `BrowserWindow`
  - > 1 params: receives event args + `BrowserWindow` appended last

## Preload behavior

- Default preload path resolves from configured `distMain` output (`preload.cjs`).
- To override for a specific window, set `options.webPreferences.preload` in `@WindowManager` config.

## Dynamic route windows

- Pass route-specific `hash` in `window.create({ hash: "window:feature/<id>" })`.
- Keep manager default hash stable and use per-instance hash for route-specific windows.
- Works well with renderer routers reading params from hash route.

## Lazy module constraints (strict)

Lazy modules are enabled via:

```ts
lazy: { enabled: true, trigger: "channel" }
```

Rules:

- Lazy module **cannot** define `exports`.
- Lazy module may import only eager modules.
- Eager modules must not import lazy modules.
- Trigger must be unique within bootstrap set.

Behavior:

- Registered at bootstrap.
- Initialized on first `ipcRenderer.invoke(trigger)`.
- Defers initialization work, not automatic JS bundle code-splitting.

## Type safety conventions

- Type windows with `TWindows["key"]` in both `@WindowManager` and `getWindow` usage.
- Type providers/interfaces explicitly for `useFactory` outputs.
- Keep channel payload/response types explicit to avoid renderer-main contract drift.

## API quick reference

- Decorators: `@RgModule`, `@Injectable`, `@Inject`, `@IpcHandler`, `@WindowManager`
- Functions: `initSettings`, `bootstrapModules`, `getWindow`, `destroyWindows`
- Lifecycle interfaces: `TIpcHandlerInterface`, `TWindowManager`

## Usage examples

### 1) Bootstrap in `main.ts`

```ts
import { bootstrapModules, initSettings } from "@devisfuture/electron-modular";
import { app } from "electron";

import { UserModule } from "./user/module.js";

import { DictionariesModule } from "./dictionaries/module.js";

initSettings({
  localhostPort: process.env.LOCALHOST_ELECTRON_SERVER_PORT ?? "",
  cspConnectSources: process.env.BASE_REST_API
    ? [process.env.BASE_REST_API]
    : [],
  folders: {
    distRenderer: "dist-renderer",
    distMain: "dist-main",
  },
});

app.on("ready", async () => {
  await bootstrapModules([UserModule, DictionariesModule]);
});
```

### 2) Basic feature module (`module.ts`)

```ts
import { RgModule } from "@devisfuture/electron-modular";

import { DictionariesIpc } from "./ipc.js";
import { DictionariesService } from "./service.js";
import { DictionariesWindow } from "./window.js";

@RgModule({
  providers: [DictionariesService],
  ipc: [DictionariesIpc],
  windows: [DictionariesWindow],
  exports: [DictionariesService],
})
export class DictionariesModule {}
```

### 3) IPC handler that opens a typed window

```ts
import {
  IpcHandler,
  type TIpcHandlerInterface,
  type TParamOnInit,
} from "@devisfuture/electron-modular";
import { type IpcMainEvent, ipcMain } from "electron";

@IpcHandler()
export class DictionariesIpc implements TIpcHandlerInterface {
  onInit({ getWindow }: TParamOnInit<TWindows["dictionary"]>): void {
    const dictionaryWindow = getWindow("window:dictionary");

    ipcMain.on("dictionary:open", async (_: IpcMainEvent, id: string) => {
      await dictionaryWindow.create({
        hash: `window:dictionary/${id}`,
      });
    });
  }
}
```

### 4) Window manager with lifecycle hook

```ts
import {
  type TWindowManager,
  WindowManager,
} from "@devisfuture/electron-modular";
import { BrowserWindow } from "electron";

@WindowManager<TWindows["dictionary"]>({
  hash: "window:dictionary",
  isCache: true,
  options: {
    width: 900,
    height: 700,
  },
})
export class DictionariesWindow implements TWindowManager {
  onWebContentsDidFinishLoad(window: BrowserWindow): void {
    window.webContents.send("dictionary:window:ready");
  }
}
```

### 5) Lazy module trigger example

```ts
@RgModule({
  providers: [AnalyticsService],
  ipc: [AnalyticsIpc],
  lazy: {
    enabled: true,
    trigger: "analytics:init",
  },
})
export class AnalyticsModule {}
```

Renderer usage:

```ts
await window.electron.invoke("analytics:init");
```

### 6) Full lazy-module flow (main + renderer)

Main process (`analytics/module.ts`):

```ts
import { RgModule } from "@devisfuture/electron-modular";

import { AppModule } from "../app/module.js";
import { AnalyticsIpc } from "./ipc.js";
import { AnalyticsService } from "./service.js";

@RgModule({
  imports: [AppModule],
  providers: [AnalyticsService],
  ipc: [AnalyticsIpc],
  lazy: {
    enabled: true,
    trigger: "init-analytics-lazy",
  },
})
export class AnalyticsModule {}
```

Main bootstrap (`main.ts`):

```ts
await bootstrapModules([UserModule, DictionariesModule, AnalyticsModule]);
```

Renderer trigger (for example on first Analytics screen open):

```ts
const response = await window.electron.invoke("init-analytics-lazy");

if (response?.initialized && response?.error === undefined) {
  console.log("Analytics module initialized", response.name);
} else {
  console.error("Analytics module init failed", response?.error);
}
```

Notes:

- Keep trigger names unique across all lazy modules.
- Do not add `exports` inside lazy modules.
- Let eager modules depend only on eager modules.

## Implementation checklist

When applying this skill:

1. Configure `initSettings` correctly and verify dist folder names.
2. Place logic into module/service/ipc/window boundaries.
3. Use token-based providers for cross-module contracts.
4. Type `TWindows` mappings and window access points.
5. Enforce lazy-module constraints if lazy is used.
6. Verify IPC handlers and window lifecycle methods are wired in `onInit` / class hooks.
7. Keep architecture changes minimal and deterministic.
