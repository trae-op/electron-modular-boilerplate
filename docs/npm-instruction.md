# Package Documentation

[![npm version](https://img.shields.io/npm/v/@devisfuture/electron-modular.svg)](https://www.npmjs.com/package/@devisfuture/electron-modular) [![Downloads](https://img.shields.io/npm/dm/@devisfuture/electron-modular.svg)](https://www.npmjs.com/package/@devisfuture/electron-modular) [![Build](https://img.shields.io/github/actions/workflow/status/trae-op/electron-modular/ci.yml?branch=main)](https://github.com/trae-op/electron-modular/actions/workflows/ci.yml) [![Coverage](https://img.shields.io/codecov/c/github/trae-op/electron-modular/main)](https://codecov.io/gh/trae-op/electron-modular) [![Bundle size](https://img.shields.io/bundlephobia/minzip/@devisfuture/electron-modular)](https://bundlephobia.com/package/@devisfuture/electron-modular) [![License](https://img.shields.io/npm/l/@devisfuture/electron-modular.svg)](https://github.com/trae-op/electron-modular/blob/main/LICENSE) [![TypeScript](https://img.shields.io/badge/TypeScript-%233178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## Overview

A lightweight dependency injection container for Electron's main process that brings modular architecture and clean code organization to your desktop applications.

### What It Solves

Building complex Electron apps often leads to tightly coupled code, scattered IPC handlers, and difficulty managing window lifecycles. This package addresses these challenges by providing:

- **Organized Code Structure** - Split your application into independent, testable modules instead of monolithic files
- **Automatic Dependency Management** - No more manual service instantiation or passing dependencies through multiple layers
- **Centralized IPC Logic** - Group related IPC handlers with their business logic instead of scattering them across your codebase
- **Window Lifecycle Control** - Manage BrowserWindow creation, caching, and event handling in dedicated classes
- **Type-Safe Module Boundaries** - Share only necessary interfaces between modules using the provider pattern

### What You Get

The package uses TypeScript decorators (`@RgModule`, `@Injectable`, `@IpcHandler`, `@WindowManager`) to eliminate boilerplate and let you focus on business logic. Services are automatically instantiated with their dependencies, IPC handlers are registered during module initialization, and windows are created with lifecycle hooks that run at the right time.

Instead of wrestling with service initialization order or managing global state, you define modules with clear dependencies and let the container handle the rest.

### Key Features

- **Dependency Injection** - Automatic service instantiation and injection
- **Module System** - Organize code into feature modules
- **TypeScript Decorators** - `@RgModule`, `@Injectable`, `@IpcHandler`, `@WindowManager`
- **Provider Pattern** - Share only necessary interfaces between modules
- **Type Safety** - Full TypeScript support

---

## Installation

Install with your package manager:

```bash
# npm
npm install @devisfuture/electron-modular

# yarn
yarn add @devisfuture/electron-modular

# pnpm
pnpm add @devisfuture/electron-modular
```

Peer dependency:

This package targets Electron's main process and declares Electron >=36 as a peer dependency. Ensure Electron is installed in your project:

```bash
npm install --save-dev electron@^36
```

TypeScript setup:

- Enable decorators and metadata in your `tsconfig.json`:

```json
"experimentalDecorators": true,
"emitDecoratorMetadata": true
```

> Tip: This package is published as ESM. When importing local modules, use `.js` extensions in runtime imports, e.g. `import { UserModule } from "./user/module.js"`.

---

## Quick Start

### 1. Bootstrap Application `main.ts`

Initialize the framework and bootstrap all modules:

```typescript
import { app } from "electron";
import { initSettings, bootstrapModules } from "@devisfuture/electron-modular";
import { UserModule } from "./user/module.js";
import { ResourcesModule } from "./resources/module.js";

initSettings({
  baseRestApi: process.env.BASE_REST_API ?? "",
  localhostPort: process.env.LOCALHOST_ELECTRON_SERVER_PORT ?? "",
  folders: {
    distRenderer: "dist-renderer",
    distMain: "dist-main",
  },
});

app.on("ready", async () => {
  await bootstrapModules([
    UserModule,
    ResourcesModule,
    // ... other modules
  ]);
});
```

---

## Module Structure

An example of each module's structure, but you can use your own:

```
user/
├── module.ts      # Module definition
├── service.ts     # Business logic or several services in the folder
├── ipc.ts         # IPC handlers (optional) or several ipc in the folder
├── window.ts      # Window manager (optional) or several windows in the folder
├── tokens.ts      # DI tokens (optional)
└── types.ts       # Type definitions (optional)
```

---

## Two Approaches to Using Modules

### Approach 1: Direct Service Injection (Simple)

Import a module and directly inject its exported service.

#### Module Definition `user/module.ts`

```typescript
import { RgModule } from "@devisfuture/electron-modular";
import { RestApiModule } from "../rest-api/module.js";
import { UserService } from "./service.js";
import { UserIpc } from "./ipc.js";

@RgModule({
  imports: [RestApiModule],
  ipc: [UserIpc],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

#### Service Implementation `user/service.ts`

```typescript
import { Injectable } from "@devisfuture/electron-modular";
import { RestApiService } from "../rest-api/service.js";

@Injectable()
export class UserService {
  constructor(private restApiService: RestApiService) {}

  async byId<R extends TUser>(id: string): Promise<R | undefined> {
    const response = await this.restApiService.get<R>(
      `https://example.com/api/users/${id}`,
    );

    if (response.error !== undefined) {
      return;
    }

    return response.data;
  }
}
```

**When to use:**

- Simple dependencies
- You need the full service functionality
- No circular dependency issues

---

### Approach 2: Provider Pattern (Advanced)

Use `provide` and `useFactory` to expose only necessary interface.

#### tokens.ts

```typescript
export const USER_REST_API_PROVIDER = Symbol("USER_REST_API_PROVIDER");
```

#### types.ts

```typescript
export type TUserRestApiProvider = {
  get: <T>(
    endpoint: string,
    options?: AxiosRequestConfig,
  ) => Promise<TResponse<T>>;
  post: <T>(
    endpoint: string,
    data: unknown,
    options?: AxiosRequestConfig,
  ) => Promise<TResponse<T>>;
};
```

#### Module Definition `user/module.ts`

```typescript
import { RgModule } from "@devisfuture/electron-modular";
import { RestApiModule } from "../rest-api/module.js";
import { RestApiService } from "../rest-api/service.js";
import { UserService } from "./service.js";
import { UserIpc } from "./ipc.js";
import { USER_REST_API_PROVIDER } from "./tokens.js";
import type { TUserRestApiProvider } from "./types.js";

@RgModule({
  imports: [RestApiModule],
  ipc: [UserIpc],
  providers: [
    UserService,
    {
      provide: USER_REST_API_PROVIDER,
      useFactory: (restApiService: RestApiService): TUserRestApiProvider => ({
        get: (endpoint, options) => restApiService.get(endpoint, options),
        post: (endpoint, data, options) =>
          restApiService.post(endpoint, data, options),
      }),
      inject: [RestApiService],
    },
  ],
  exports: [UserService],
})
export class UserModule {}
```

#### Service Implementation `user/service.ts`

```typescript
@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REST_API_PROVIDER)
    private restApiProvider: TUserRestApiProvider,
  ) {}

  async byId<R extends TUser>(id: string): Promise<R | undefined> {
    const response = await this.restApiProvider.get<R>(
      `https://example.com/api/users/${id}`,
    );

    if (response.error !== undefined) {
      return;
    }

    return response.data;
  }
}
```

**When to use:**

- Need to expose limited interface
- Prevent circular dependencies
- Multiple implementations possible
- Better encapsulation

---

## IPC Handlers

Handle communication between main and renderer processes.

```typescript
import {
  IpcHandler,
  TIpcHandlerInterface,
  TParamOnInit,
} from "@devisfuture/electron-modular";
import { UserService } from "./service.js";

@IpcHandler()
export class UserIpc implements TIpcHandlerInterface {
  constructor(private userService: UserService) {}

  async onInit({ getWindow }: TParamOnInit<TWindows["main"]>) {
    const mainWindow = getWindow("window:main");

    ipcMainOn("user:fetch", async (event, userId: string) => {
      const user = await this.userService.byId(userId);
      event.reply("user:fetch:response", user);
    });
  }
}
```

---

## Window Managers

Manage BrowserWindow lifecycle and configuration.

```typescript
import { WindowManager } from "@devisfuture/electron-modular";
import type { TWindowManager } from "../types.js";

@WindowManager<TWindows["userProfile"]>({
  hash: "window:user-profile",
  isCache: true,
  options: {
    width: 600,
    height: 400,
    resizable: false,
  },
})
export class UserWindow implements TWindowManager {
  constructor(private userService: UserService) {}

  onWebContentsDidFinishLoad(window: BrowserWindow): void {
    // Initialize when window content loads
    this.loadUserData(window);
  }

  private async loadUserData(window: BrowserWindow): Promise<void> {
    const user = await this.userService.getCurrentUser();
    window.webContents.send("user:loaded", user);
  }
}
```

### Lifecycle Hooks (Window & WebContents events) ✅

The window manager supports lifecycle hooks by naming methods on your class following a simple convention:

- Use `on<ClassicEvent>` for BrowserWindow events (e.g. `onFocus`, `onMaximize`).
- Use `onWebContents<Thing>` for WebContents events (e.g. `onWebContentsDidFinishLoad`, `onWebContentsWillNavigate`).

How method names map to Electron events:

- The framework removes the `on` or `onWebContents` prefix, converts the remaining CamelCase to kebab-case and uses that as the event name.
  - `onFocus` → `focus`
  - `onMaximize` → `maximize`
  - `onWebContentsDidFinishLoad` → `did-finish-load`
  - `onWebContentsWillNavigate` → `will-navigate`

Handler signatures and parameters 🔧

- If your method declares 0 or 1 parameter (i.e. `handler.length <= 1`) it will be called with the `BrowserWindow` instance only:

```ts
onFocus(window: BrowserWindow): void {
  // Called when window receives focus
  window.webContents.send("window:focused");
}
```

- If your method declares more than 1 parameter, the original Electron event arguments are forwarded first and the `BrowserWindow` is appended as the last argument. This is useful for WebContents or events that include event objects and additional data:

```ts
onWebContentsWillNavigate(ev: Electron.Event, url: string, window: BrowserWindow) {
  // ev and url come from webContents, window is appended by the framework
  console.log("navigating to", url);
}
```

Common BrowserWindow events you can handle:

- `onFocus`, `onBlur`, `onMaximize`, `onUnmaximize`, `onMinimize`, `onRestore`, `onResize`, `onMove`, `onClose`, `onClosed`

Common WebContents events you can handle:

- `onWebContentsDidFinishLoad`, `onWebContentsDidFailLoad`, `onWebContentsDomReady`, `onWebContentsWillNavigate`, `onWebContentsDidNavigate`, `onWebContentsNewWindow`, `onWebContentsDestroyed`

Important implementation notes ⚠️

- Handlers are attached per BrowserWindow instance and cleaned up automatically when the window is closed, so you don't have to manually remove listeners.
- The same instance and set of handlers are tracked in a WeakMap internally; re-attaching the same `windowInstance` will not duplicate listeners.

---

## TypeScript types — `TWindows["myWindow"]`

`TWindows` maps window keys to their unique hash strings. Use `TWindows["<key>"]` for typing windows in `@WindowManager` and `getWindow`.

```typescript
// types/windows.d.ts
type TWindows = {
  main: "window:main";
  updateResource: "window/resource/update";
};
```

Examples:

```typescript
// Using as generic for WindowManager
@WindowManager<TWindows["main"]>({
  hash: "window:main",
  isCache: true,
  options: {},
})
export class AppWindow implements TWindowManager {}

// Using with getWindow()
const mainWindow = getWindow<TWindows["main"]>("window:main");
```

---

## API Reference

### Core Decorators

#### `@RgModule(config)`

Defines a module with its dependencies and providers.

**Parameters:**

- `imports?: Class[]` - Modules to import
- `providers?: Provider[]` - Services and factories
- `ipc?: Class[]` - IPC handler classes
- `windows?: Class[]` - Window manager classes
- `exports?: Class[]` - Providers to export

#### `@Injectable()`

Marks a class as injectable into the DI container.

```typescript
@Injectable()
export class MyService {
  constructor(private dependency: OtherService) {}
}
```

#### `@Inject(token)`

Injects a dependency by token (Symbol).

```typescript
constructor(
  @Inject(MY_PROVIDER) private provider: TMyProvider
) {}
```

#### `@IpcHandler()`

Marks a class as an IPC communication handler.

```typescript
@IpcHandler()
export class MyIpc implements TIpcHandlerInterface {
  async onInit({ getWindow }: TParamOnInit) {
    // Setup IPC listeners
  }
}
```

#### `@WindowManager<T>(config)`

Defines a BrowserWindow manager.

**Parameters:**

- `hash: string` - Unique window identifier
- `isCache?: boolean` - Cache window instance
- `options: BrowserWindowConstructorOptions` - Electron window options

```typescript
@WindowManager<TWindows["myWindow"]>({
  hash: "window:my-window",
  isCache: true,
  options: { width: 800, height: 600 },
})
export class MyWindow implements TWindowManager {
  onWebContentsDidFinishLoad(window: BrowserWindow): void {
    // Lifecycle hook
  }
}
```

### Core Functions

#### `initSettings(config)`

Initializes framework configuration.

**Parameters:**

- `baseRestApi: string` - Base REST API URL
- `localhostPort: string` - Development server port
- `folders: { distRenderer: string; distMain: string }` - Build output folders

```typescript
initSettings({
  baseRestApi: process.env.BASE_REST_API ?? "",
  localhostPort: process.env.LOCALHOST_ELECTRON_SERVER_PORT ?? "",
  folders: {
    distRenderer: "dist-renderer",
    distMain: "dist-main",
  },
});
```

#### `bootstrapModules(modules[])`

Bootstraps all modules and initializes the DI container.

```typescript
await bootstrapModules([AppModule, AuthModule, ResourcesModule]);
```

#### `getWindow<T>(hash)`

Retrieves a window instance by its hash identifier.

```typescript
const mainWindow = getWindow<TWindows["main"]>("window:main");
const window = await mainWindow.create();
```

#### `destroyWindows()`

Destroys all cached windows.

```typescript
...
import { destroyWindows } from "@devisfuture/electron-modular";
...

app.on("before-quit", () => {
  destroyWindows();
});
```

### Lifecycle Interfaces

#### `TIpcHandlerInterface`

Interface for IPC handlers.

```typescript
export interface TIpcHandlerInterface {
  onInit?(params: TParamOnInit): void | Promise<void>;
}
```

#### `TWindowManager`

Interface for window managers.

```typescript
export interface TWindowManager {
  onWebContentsDidFinishLoad?(window: BrowserWindow): void;
}
```

---

## Module Structure

Recommended file organization for a feature module:

```
my-feature/
├── module.ts          # Module definition with @RgModule
├── service.ts         # Main business logic service
├── ipc.ts             # IPC communication handlers
├── window.ts          # BrowserWindow manager
├── tokens.ts          # Dependency injection tokens
├── types.ts           # TypeScript type definitions
└── services/          # Additional services (optional)
    ├── helper.ts
    └── validator.ts
```

---

## Best Practices

### 1. Use Providers for Cross-Module Communication

✅ **Good:**

```typescript
{
  provide: AUTH_PROVIDER,
  useFactory: (authService: AuthService): TAuthProvider => ({
    checkAuthenticated: (window) => authService.checkAuthenticated(window),
    logout: (window) => authService.logout(window),
  }),
  inject: [AuthService],
}
```

❌ **Bad:**

```typescript
// Don't export entire service
exports: [AuthService];
```

### 2. Keep Services Focused

Each service should have a single responsibility.

✅ **Good:**

```typescript
@Injectable()
export class ResourcesService {
  // Only handles resource data operations
}

@Injectable()
export class CacheWindowsService {
  // Only handles window caching
}
```

### 3. Use Tokens for All Cross-Module Dependencies

✅ **Good:**

```typescript
export const RESOURCES_REST_API_PROVIDER = Symbol("RESOURCES_REST_API_PROVIDER");

constructor(
  @Inject(RESOURCES_REST_API_PROVIDER) private restApiProvider
) {}
```

### 4. Implement Lifecycle Hooks

Use lifecycle hooks for initialization logic.

```typescript
@IpcHandler()
export class MyIpc implements TIpcHandlerInterface {
  async onInit({ getWindow }: TParamOnInit) {
    // Initialize IPC listeners
  }
}

@WindowManager(config)
export class MyWindow implements TWindowManager {
  onWebContentsDidFinishLoad(window: BrowserWindow): void {
    // Initialize when content loads
  }
}
```

### 5. Type Everything

Use TypeScript for all services, providers, and interfaces.
Decorators Reference

### `@RgModule(config)`

Defines a module.

- `imports?: Class[]` - Modules to import
- `providers?: Provider[]` - Services and factories
- `ipc?: Class[]` - IPC handler classes
- `windows?: Class[]` - Window manager classes
- `exports?: Class[]` - Providers to export

### `@Injectable()`

Makes a class injectable.

```typescript
@Injectable()
export class MyService {}
```

### `@Inject(token)`

Injects a dependency by token.

```typescript
constructor(@Inject(MY_PROVIDER) private provider: TMyProvider) {}
```

### `@IpcHandler()`

Marks a class as IPC handler.

```typescript
@IpcHandler()
export class MyIpc implements TIpcHandlerInterface {}
```

### `@WindowManager<T>(config)`

Defines a window manager.

```typescript
@WindowManager<TWindows["myWindow"]>({
  hash: "window:my-window",
  isCache: true,
  options: { width: 800, height: 600 },
})
export class MyWindow implements TWindowManager {}
```

---

## Key Functions

### `initSettings(config)`

```typescript
initSettings({
  baseRestApi: process.env.BASE_REST_API ?? "",
  localhostPort: process.env.LOCALHOST_ELECTRON_SERVER_PORT ?? "",
  folders: { distRenderer: "dist-renderer", distMain: "dist-main" },
});
```

### `bootstrapModules(modules[])`

```typescript
await bootstrapModules([AppModule, UserModule]);
```

### `getWindow<T>(hash)`

```typescript
const mainWindow = getWindow<TWindows["main"]>("window:main");
const window = await mainWindow.create();
```

### `destroyWindows()`

```typescript
app.on("before-quit", () => destroyWindows());
```
