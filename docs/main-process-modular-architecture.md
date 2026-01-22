# Electron Main Process Architecture Guide

## Overview

This guide describes the modular architecture of the Electron main process, built using the `@devisfuture/electron-modular` package. The architecture follows a **Dependency Injection (DI)** pattern with a clear separation of concerns through modules, services, IPC handlers, and window managers.

## Core Architecture Principles

### 1. Modular Design

- Each feature is encapsulated in its own module directory
- Modules are self-contained with clear responsibilities
- Modules can import other modules to reuse functionality

### 2. Dependency Injection

- Services are automatically injected into constructors
- Providers define how dependencies are created
- Tokens are used for custom dependency injection

### 3. Separation of Concerns

- **Module**: Configuration and dependency registration
- **Service**: Business logic and state management
- **IPC Handler**: Communication with renderer process
- **Window Manager**: Window lifecycle management
- **Types**: TypeScript type definitions
- **Tokens**: Dependency injection tokens

## Directory Structure

```architecture
src/main/
├── app.ts                    # Application entry point
├── config.ts                 # Global configuration
├── preload.cts              # Preload script
├── types.ts                 # Global types
├── @shared/                 # Shared utilities
│   ├── store.ts            # State management (Map + electron-store)
│   ├── logger.ts           # Logging utilities
│   ├── utils.ts            # Common utilities
│   └── ipc/                # IPC utilities
│       ├── ipc.ts
│       └── types.ts
├── app/                     # Main application module
│   ├── module.ts
│   ├── service.ts
│   ├── ipc.ts
│   ├── window.ts
│   ├── tokens.ts
│   └── types.ts
├── auth/                    # Authentication module
├── user/                    # User management module
├── updater/                 # Auto-updater module
├── notification/            # Notifications module
├── menu/                    # Menu module (no window)
├── tray/                    # System tray module (no window)
└── rest-api/                # REST API client module (no window, no IPC)
```

## Application Entry Point

**File**: `src/main/app.ts`

```
import { isDev } from "#shared/utils.js";
import { bootstrapModules, initSettings } from "@devisfuture/electron-modular";
import dotenv from "dotenv";
import { Menu, app } from "electron";
import path from "node:path";

import { folders } from "#main/config.js";

import { AppPreloadModule } from "#main/app-preload/module.js";
import { AppVersionModule } from "#main/app-version/module.js";
import { AppModule } from "#main/app/module.js";
import { AuthModule } from "#main/auth/module.js";
import { NotificationModule } from "#main/notification/module.js";
import { UpdaterModule } from "#main/updater/module.js";
import { UserModule } from "#main/user/module.js";

// Load environment variables
const envPath = path.join(process.resourcesPath, ".env");
dotenv.config(!isDev() ? { path: envPath } : undefined);

// Disable hardware acceleration
app.disableHardwareAcceleration();

// Remove default menu
Menu.setApplicationMenu(null);

// Initialize framework settings
const source = process.env.BASE_REST_API;
initSettings({
  cspConnectSources: source ? [source] : [],
  localhostPort: process.env.LOCALHOST_PORT ?? "",
  folders: {
    distRenderer: folders.distRenderer,
    distMain: folders.distMain,
  },
});

// Bootstrap all modules when app is ready
app.on("ready", async () => {
  await bootstrapModules([
    AppPreloadModule,
    AppModule,
    AuthModule,
    UserModule,
    NotificationModule,
    UpdaterModule,
    AppVersionModule,
  ]);
});
```

**Key Points**:

- Modules are bootstrapped in order when the app is ready
- Settings are initialized before module bootstrapping
- Environment variables are loaded from `.env` file

---

## Module Architecture

### Module Types

#### 1. Full-Featured Module (with Window + IPC + Service)

**Example**: `AppModule`, `AuthModule`, `UpdaterModule`

Contains:

- `module.ts` - Module configuration
- `service.ts` - Business logic
- `ipc.ts` - IPC handlers
- `window.ts` - Window manager
- `types.ts` - Type definitions
- `tokens.ts` (optional) - DI tokens

#### 2. Service-Only Module (no Window, no IPC)

**Example**: `MenuModule`, `TrayModule`, `RestApiModule`

Contains:

- `module.ts` - Module configuration
- `service.ts` - Business logic
- `types.ts` (optional) - Type definitions

Used for shared services that don't need UI or direct renderer communication.

#### 3. IPC-Only Module (with IPC + Service, no Window)

**Example**: `NotificationModule`

Contains:

- `module.ts` - Module configuration
- `service.ts` - Business logic
- `ipc.ts` - IPC handlers
- `types.ts` - Type definitions

Used for features that don't require a window but need renderer communication.

---

## Component Breakdown

### 1. Module (`module.ts`)

The module file defines the structure and dependencies using the `@RgModule` decorator.

**Example: Simple Module (Service Only)**

```
import { RgModule } from "@devisfuture/electron-modular";

import { MenuService } from "./service.js";

@RgModule({
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
```

**Example: Full Module (with imports, providers, IPC, windows)**

```
import { RgModule } from "@devisfuture/electron-modular";

import { MenuModule } from "#main/menu/module.js";
import { MenuService } from "#main/menu/service.js";
import { TrayModule } from "#main/tray/module.js";
import { TrayService } from "#main/tray/service.js";

import { AppIpc } from "./ipc.js";
import { AppService } from "./service.js";
import { MENU_PROVIDER, TRAY_PROVIDER } from "./tokens.js";
import type { TMenuProvider, TTrayProvider } from "./types.js";
import { AppWindow } from "./window.js";

@RgModule({
  imports: [MenuModule, TrayModule],
  ipc: [AppIpc],
  windows: [AppWindow],
  providers: [
    AppService,
    {
      provide: MENU_PROVIDER,
      useFactory: (menuService: MenuService): TMenuProvider => ({
        getMenu: () => menuService.getMenu(),
        collect: (items) => menuService.collectMenu(items),
      }),
      inject: [MenuService],
    },
    {
      provide: TRAY_PROVIDER,
      useFactory: (trayService: TrayService): TTrayProvider => ({
        getMenu: () => trayService.getMenu(),
        collect: (items) => trayService.collect(items),
        destroy: () => trayService.destroy(),
      }),
      inject: [TrayService],
    },
  ],
})
export class AppModule {}
```

**Module Configuration Properties**:

- **`imports`**: Array of other modules to import and use their exported services
- **`providers`**: Services and factories available within this module
- **`exports`**: Services that other modules can import and use
- **`ipc`**: IPC handlers for communication with renderer
- **`windows`**: Window managers for UI windows

**Provider Types**:

1. **Class Provider**: `MenuService` - Direct class instantiation
2. **Factory Provider**: Uses `useFactory` to create custom instances or wrappers
   - `provide`: Token (usually a Symbol)
   - `useFactory`: Function that creates the provider value
   - `inject`: Dependencies needed by the factory

---

### 2. Service (`service.ts`)

Services contain business logic and are marked with `@Injectable()` decorator.

**Example: Simple Service**

```
import { isPlatform } from "#shared/utils.js";
import { Injectable } from "@devisfuture/electron-modular";
import { Menu } from "electron";

import { menu } from "../config.js";

import type { TMenuItem } from "#main/types.js";

@Injectable()
export class MenuService {
  constructor() {}

  getMenu(): TMenuItem[] {
    return defaultMenu.get("default")!;
  }

  collectMenu(items?: TMenuItem[]): void {
    this.build(items !== undefined ? items : this.getMenu());
  }

  private build(items?: TMenuItem[]): void {
    Menu.setApplicationMenu(
      Menu.buildFromTemplate(items !== undefined ? items : this.getMenu()),
    );
  }
}
```

**Example: Service with Injected Dependencies**

```
import { Inject, Injectable, getWindow } from "@devisfuture/electron-modular";
import { app } from "electron";

import { TRAY_PROVIDER } from "./tokens.js";
import type { TTrayProvider } from "./types.js";

@Injectable()
export class AppService {
  constructor(@Inject(TRAY_PROVIDER) private trayProvider: TTrayProvider) {}

  destroyTrayAndWindows(): void {
    this.trayProvider.destroy();
    const preloadAppWindow =
      getWindow<TWindows["preloadApp"]>("window:preload-app");

    if (preloadAppWindow !== undefined) {
      preloadAppWindow.destroy();
    }
  }

  dockHide() {
    if (app.dock) {
      app.dock.hide();
    }
  }
}
```

**Key Points**:

- Use `@Injectable()` decorator
- Inject dependencies via constructor using `@Inject(TOKEN)`
- Keep business logic pure and testable
- Private methods for internal implementation

---

### 3. IPC Handler (`ipc.ts`)

IPC handlers manage communication between main and renderer processes.

**Example: Basic IPC Handler**

```
import { ipcMainOn } from "#shared/ipc/ipc.js";
import {
  Inject,
  IpcHandler,
  TIpcHandlerInterface,
  TParamOnInit,
  getWindow as getWindows,
} from "@devisfuture/electron-modular";
import { app, dialog } from "electron";

import { messages } from "../config.js";

import { AppService } from "./service.js";
import type { TDestroyProcess } from "./types.js";

@IpcHandler()
export class AppIpc implements TIpcHandlerInterface {
  constructor(private appService: AppService) {
    // Register process error handlers
    process.on("uncaughtException", (error) => {
      this.destroyProcess({
        error,
        message: error.message,
        title: messages.crash.uncaughtException,
      });
    });

    process.on("unhandledRejection", (reason) => {
      this.destroyProcess({
        error: reason,
        message: messages.crash.unhandledRejection,
        title: messages.crash.unhandledRejection,
      });
    });

    app.on("render-process-gone", (_event, _webContents, details) => {
      this.destroyProcess({
        error: details,
        message: `Exit Code: ${details.exitCode}, Reason: ${details.reason}`,
        title: messages.crash.renderProcessGone,
      });
    });
  }

  private destroyProcess({ error, message, title }: TDestroyProcess) {
    if (error !== undefined) {
      console.error(error);
    }

    this.appService.destroyTrayAndWindows();
    this.appService.dockHide();

    dialog.showMessageBox({
      title,
      message,
    });
  }

  async onInit({ getWindow }: TParamOnInit<TWindows["main"]>) {
    const mainWindow = getWindow("window:main");
    const window = await mainWindow.create();

    ipcMainOn("windowClosePreload", async () => {
      const preloadAppWindow =
        getWindows<TWindows["preloadApp"]>("window:preload-app");
      if (preloadAppWindow !== undefined) {
        preloadAppWindow.hide();
      }

      if (window !== undefined) {
        window.show();
      }
    });
  }
}
```

**Key Points**:

- Use `@IpcHandler()` decorator
- Implement `TIpcHandlerInterface` (optional but recommended)
- `onInit()` lifecycle method is called when window is initialized
- Constructor can set up event listeners
- Use `ipcMainOn`, `ipcMainHandle`, `ipcMainInvoke` for IPC communication

---

### 4. Window Manager (`window.ts`)

Window managers control window lifecycle and behavior.

**Example: Window Manager**

```
import { isDev } from "#shared/utils.js";
import {
  Inject,
  WindowManager,
  destroyWindows,
} from "@devisfuture/electron-modular";
import { BrowserWindow, Event, app } from "electron";

import { menu } from "#main/config.js";

import type { TWindowManager } from "../types.js";
import { MENU_PROVIDER, TRAY_PROVIDER } from "./tokens.js";
import type { TMenuProvider, TTrayProvider } from "./types.js";

@WindowManager<TWindows["main"]>({
  hash: "window:main",
  isCache: true,
  options: {
    resizable: isDev(),
    show: false,
    width: 500,
    height: 500,
  },
})
export class AppWindow implements TWindowManager {
  private isWillClose = false;

  constructor(
    @Inject(MENU_PROVIDER) private readonly menuProvider: TMenuProvider,
    @Inject(TRAY_PROVIDER) private readonly trayProvider: TTrayProvider,
  ) {
    app.on("before-quit", () => {
      this.isWillClose = true;

      this.trayProvider.destroy();
      destroyWindows();
    });
  }

  onWebContentsDidFinishLoad(window: BrowserWindow): void {
    // Configure menu after window loads
    this.menuProvider.collect(
      this.menuProvider.getMenu().map((item) => {
        if (item.name === "app") {
          item.submenu = [
            {
              label: menu.labels.devTools,
              click: () => window.webContents.openDevTools(),
            },
            {
              label: menu.labels.quit,
              click: () => app.quit(),
            },
          ];
        }
        return item;
      }),
    );

    // Configure tray menu
    this.trayProvider.collect(
      this.trayProvider.getMenu().map((item) => {
        if (item.name === "show") {
          item.click = () => {
            window.show();
            if (app.dock) {
              app.dock.show();
            }
          };
        }

        if (item.name === "quit") {
          item.click = () => app.quit();
        }
        return item;
      }),
    );
  }

  onShow(): void {
    this.isWillClose = false;
  }

  onClose(event: Event, window: BrowserWindow): void {
    if (this.isWillClose) {
      return;
    }

    event.preventDefault();
    window.hide();
    if (app.dock) {
      app.dock.hide();
    }
  }
}
```

**Window Manager Configuration**:

- `hash`: Unique identifier for the window (matches `TWindows` type)
- `isCache`: Whether to cache the window instance
- `options`: BrowserWindow options

**Lifecycle Methods**:

- `onWebContentsDidFinishLoad(window)`: Called when window content is loaded
- `onShow()`: Called when window is shown
- `onClose(event, window)`: Called before window closes
- `onHide(window)`: Called when window is hidden
- `onCreate(window)`: Called when window is created

---

### 5. Tokens (`tokens.ts`)

Tokens are Symbols used for custom dependency injection.

```
export const MENU_PROVIDER = Symbol("MENU_PROVIDER");
export const TRAY_PROVIDER = Symbol("TRAY_PROVIDER");
```

**Usage**:

1. Define token as a Symbol
2. Use in module's provider factory with `provide: TOKEN`
3. Inject in services/windows with `@Inject(TOKEN)`

**Why Use Tokens?**

- Create abstraction layers over services
- Limit exposed functionality (interface segregation)
- Enable easier testing and mocking
- Decouple modules from concrete implementations

---

### 6. Types (`types.ts`)

Type definitions for the module.

```
import type { TMenuItem } from "#main/types.js";

export type TDestroyProcess = {
  error?: any;
  message: string;
  title: string;
};

export type TMenuProvider = {
  getMenu: () => TMenuItem[];
  collect: (items?: TMenuItem[]) => void;
};

export type TTrayProvider = {
  getMenu: () => TMenuItem[];
  collect: (items?: TMenuItem[]) => void;
  destroy: () => void;
};
```

**Best Practices**:

- Prefix types with `T` (e.g., `TMenuProvider`)
- Define provider interfaces
- Export all public types

---

## Creating New Modules

### Pattern 1: Independent Module (Service Only)

**Use Case**: Shared service without UI or IPC communication (e.g., logging, utilities, API client)

**Steps**:

1. **Create module directory**:

```
mkdir src/main/my-feature
cd src/main/my-feature
```

2. **Create `types.ts`**:

```
export type TMyFeatureConfig = {
  apiKey: string;
  timeout: number;
};

export type TMyFeatureResult = {
  success: boolean;
  data: any;
};
```

3. **Create `service.ts`**:

```
import { Injectable } from "@devisfuture/electron-modular";

import type { TMyFeatureConfig, TMyFeatureResult } from "./types.js";

@Injectable()
export class MyFeatureService {
  private config: TMyFeatureConfig;

  constructor() {
    this.config = {
      apiKey: process.env.MY_API_KEY ?? "",
      timeout: 5000,
    };
  }

  async performAction(data: any): Promise<TMyFeatureResult> {
    // Business logic here
    return {
      success: true,
      data: processedData,
    };
  }

  getConfig(): TMyFeatureConfig {
    return this.config;
  }
}
```

4. **Create `module.ts`**:

```
import { RgModule } from "@devisfuture/electron-modular";

import { MyFeatureService } from "./service.js";

@RgModule({
  providers: [MyFeatureService],
  exports: [MyFeatureService],
})
export class MyFeatureModule {}
```

5. **Register in `app.ts`**:

```
import { MyFeatureModule } from "#main/my-feature/module.js";

app.on("ready", async () => {
  await bootstrapModules([
    // ... other modules
    MyFeatureModule,
  ]);
});
```

---

### Pattern 2: Module with IPC Communication

**Use Case**: Feature that needs to communicate with renderer but has no window

**Steps**:

1. **Create base structure** (same as Pattern 1)

2. **Create `ipc.ts`**:

```
import { ipcMainHandle } from "#shared/ipc/ipc.js";
import {
  IpcHandler,
  TIpcHandlerInterface,
} from "@devisfuture/electron-modular";

import { MyFeatureService } from "./service.js";
import type { TMyFeatureResult } from "./types.js";

@IpcHandler()
export class MyFeatureIpc implements TIpcHandlerInterface {
  constructor(private myFeatureService: MyFeatureService) {}

  async onInit() {
    // Handle IPC calls from renderer
    ipcMainHandle(
      "myFeature:performAction",
      async (data: any): Promise<TMyFeatureResult> => {
        return this.myFeatureService.performAction(data);
      },
    );

    ipcMainHandle("myFeature:getConfig", async () => {
      return this.myFeatureService.getConfig();
    });
  }
}
```

3. **Update `module.ts`**:

```
import { RgModule } from "@devisfuture/electron-modular";

import { MyFeatureIpc } from "./ipc.js";
import { MyFeatureService } from "./service.js";

@RgModule({
  ipc: [MyFeatureIpc],
  providers: [MyFeatureService],
  exports: [MyFeatureService],
})
export class MyFeatureModule {}
```

4. **Define IPC types** (in `types/invokes.d.ts` for invoke calls):

```
type TInvokes = {
  "myFeature:performAction": (data: any) => Promise<TMyFeatureResult>;
  "myFeature:getConfig": () => Promise<TMyFeatureConfig>;
};
```

---

### Pattern 3: Full-Featured Module (with Window)

**Use Case**: Feature with its own UI window, business logic, and IPC

**Steps**:

1. **Create base structure** (Pattern 1 + 2)

2. **Add window configuration to global types**:

In `src/main/config.ts`:

```
export const windows: TWindows = {
  main: "window:main",
  myFeature: "window:my-feature", // Add this
  // ... other windows
};
```

In `types/windows.d.ts`:

```
type TWindows = {
  main: "window:main";
  myFeature: "window:my-feature"; // Add this
  // ... other windows
};
```

3. **Create `window.ts`**:

```
import { isDev } from "#shared/utils.js";
import { WindowManager } from "@devisfuture/electron-modular";
import { BrowserWindow } from "electron";

import type { TWindowManager } from "../types.js";
import { MyFeatureService } from "./service.js";

@WindowManager<TWindows["myFeature"]>({
  hash: "window:my-feature",
  isCache: true,
  options: {
    resizable: isDev(),
    show: false,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  },
})
export class MyFeatureWindow implements TWindowManager {
  constructor(private myFeatureService: MyFeatureService) {}

  onWebContentsDidFinishLoad(window: BrowserWindow): void {
    // Called when window content is loaded
    console.log("MyFeature window loaded");

    // Perform initialization
    this.myFeatureService.initialize();

    // Show window after load
    window.show();
  }

  onCreate(window: BrowserWindow): void {
    // Called when window is created
    console.log("MyFeature window created");
  }

  onShow(): void {
    console.log("MyFeature window shown");
  }

  onHide(): void {
    console.log("MyFeature window hidden");
  }

  onClose(event: Event, window: BrowserWindow): void {
    // Prevent closing, just hide
    event.preventDefault();
    window.hide();
  }
}
```

4. **Update `module.ts`**:

```
import { RgModule } from "@devisfuture/electron-modular";

import { MyFeatureIpc } from "./ipc.js";
import { MyFeatureService } from "./service.js";
import { MyFeatureWindow } from "./window.js";

@RgModule({
  ipc: [MyFeatureIpc],
  windows: [MyFeatureWindow],
  providers: [MyFeatureService],
  exports: [MyFeatureService],
})
export class MyFeatureModule {}
```

5. **Open window from IPC or service**:

In `ipc.ts`:

```
import { TParamOnInit } from "@devisfuture/electron-modular";

async onInit({ getWindow }: TParamOnInit<TWindows["myFeature"]>) {
  const myFeatureWindow = getWindow("window:my-feature");

  // Listen for open window request
  ipcMainHandle("myFeature:openWindow", async () => {
    const window = await myFeatureWindow.create();
    window.show();
  });

  // Listen for close window request
  ipcMainHandle("myFeature:closeWindow", async () => {
    myFeatureWindow.hide();
  });
}
```

---

### Pattern 4: Module with External Dependencies

**Use Case**: Module that depends on services from other modules

**Steps**:

1. **Create module with imports**:

```
import { RgModule } from "@devisfuture/electron-modular";

import { NotificationModule } from "#main/notification/module.js";
import { NotificationService } from "#main/notification/service.js";
import { RestApiModule } from "#main/rest-api/module.js";
import { RestApiService } from "#main/rest-api/service.js";

import { MyFeatureIpc } from "./ipc.js";
import { MyFeatureService } from "./service.js";
import {
  MY_FEATURE_API_PROVIDER,
  MY_FEATURE_NOTIFICATION_PROVIDER,
} from "./tokens.js";
import type {
  TMyFeatureApiProvider,
  TMyFeatureNotificationProvider,
} from "./types.js";

@RgModule({
  imports: [RestApiModule, NotificationModule],
  ipc: [MyFeatureIpc],
  providers: [
    MyFeatureService,
    {
      provide: MY_FEATURE_API_PROVIDER,
      useFactory: (restApiService: RestApiService): TMyFeatureApiProvider => ({
        get: (endpoint, options) => restApiService.get(endpoint, options),
        post: (endpoint, data, options) =>
          restApiService.post(endpoint, data, options),
      }),
      inject: [RestApiService],
    },
    {
      provide: MY_FEATURE_NOTIFICATION_PROVIDER,
      useFactory: (
        notificationService: NotificationService,
      ): TMyFeatureNotificationProvider => ({
        show: (title, body) =>
          notificationService.setNotification({ title, body }),
      }),
      inject: [NotificationService],
    },
  ],
})
export class MyFeatureModule {}
```

2. **Create `tokens.ts`**:

```
export const MY_FEATURE_API_PROVIDER = Symbol("MY_FEATURE_API_PROVIDER");
export const MY_FEATURE_NOTIFICATION_PROVIDER = Symbol(
  "MY_FEATURE_NOTIFICATION_PROVIDER",
);
```

3. **Define provider types in `types.ts`**:

```
export type TMyFeatureApiProvider = {
  get: (endpoint: string, options?: any) => Promise<any>;
  post: (endpoint: string, data: any, options?: any) => Promise<any>;
};

export type TMyFeatureNotificationProvider = {
  show: (title: string, body: string) => void;
};
```

4. **Inject in service**:

```
import { Inject, Injectable } from "@devisfuture/electron-modular";

import {
  MY_FEATURE_API_PROVIDER,
  MY_FEATURE_NOTIFICATION_PROVIDER,
} from "./tokens.js";
import type {
  TMyFeatureApiProvider,
  TMyFeatureNotificationProvider,
} from "./types.js";

@Injectable()
export class MyFeatureService {
  constructor(
    @Inject(MY_FEATURE_API_PROVIDER) private apiProvider: TMyFeatureApiProvider,
    @Inject(MY_FEATURE_NOTIFICATION_PROVIDER)
    private notificationProvider: TMyFeatureNotificationProvider,
  ) {}

  async fetchData(): Promise<void> {
    try {
      const data = await this.apiProvider.get("/my-endpoint");
      this.notificationProvider.show("Success", "Data fetched successfully");
    } catch (error) {
      this.notificationProvider.show("Error", "Failed to fetch data");
    }
  }
}
```

---

## State Management

### In-Memory Store (Map)

Use `src/main/@shared/store.ts` for runtime state:

```
import { clearStore, deleteStore, getStore, setStore } from "#shared/store.js";

// Set value
setStore("currentUser", { id: "123", name: "John" });

// Get value
const user = getStore("currentUser");

// Delete value
deleteStore("currentUser");

// Clear all
clearStore();
```

**Use Case**: Temporary state that doesn't need persistence

### Persistent Store (electron-store)

Use electron-store for persistent data:

```
import {
  clearElectronStorage,
  deleteFromElectronStorage,
  getElectronStorage,
  setElectronStorage,
} from "#shared/store.js";

// Set persistent value
setElectronStorage("authToken", "token-123");
setElectronStorage("userId", "user-456");

// Get persistent value
const token = getElectronStorage("authToken");

// Delete persistent value
deleteFromElectronStorage("authToken");

// Clear all persistent data
clearElectronStorage();
```

**Use Case**: Data that needs to persist across app restarts (auth tokens, user preferences)

---

## IPC Communication Patterns

### 1. Handle Pattern (Request-Response)

**Main Process** (`ipc.ts`):

```
import { ipcMainHandle } from "#shared/ipc/ipc.js";

ipcMainHandle("myFeature:getData", async (userId: string) => {
  const data = await this.myFeatureService.getData(userId);
  return data;
});
```

**Renderer Process**:

```
const data = await window.api.invoke("myFeature:getData", "user-123");
```

### 2. On Pattern (One-Way Communication)

**Main Process** (`ipc.ts`):

```
import { ipcMainOn } from "#shared/ipc/ipc.js";

ipcMainOn("myFeature:saveData", async (data: any) => {
  await this.myFeatureService.saveData(data);
});
```

**Renderer Process**:

```
window.api.send("myFeature:saveData", { name: "John" });
```

### 3. Send to Renderer (Push Updates)

**Main Process** (`service.ts`):

```
import { getWindow } from "@devisfuture/electron-modular";

export class MyFeatureService {
  notifyRenderer(data: any): void {
    const window = getWindow<TWindows["main"]>("window:main");
    const browserWindow = window?.getBrowserWindow();

    if (browserWindow) {
      browserWindow.webContents.send("myFeature:dataUpdated", data);
    }
  }
}
```

**Renderer Process**:

```
window.api.receive("myFeature:dataUpdated", (data) => {
  console.log("Data updated:", data);
});
```

---

## Best Practices

### 1. Module Organization

- Keep modules focused on a single responsibility
- Use clear, descriptive names for modules and files
- Export only what's necessary from modules
- Prefer composition over inheritance

### 2. Dependency Injection

- Use tokens for abstraction and interface segregation
- Inject dependencies through constructor
- Don't create direct dependencies between modules
- Use factory providers to limit exposed functionality

### 3. Service Design

- Keep services stateless when possible
- Use shared store for state management
- Make services testable (pure functions, no side effects)
- Separate business logic from infrastructure code

### 4. IPC Communication

- Use `ipcMainHandle` for request-response patterns
- Use `ipcMainOn` for one-way communication
- Always validate data from renderer
- Define IPC types in global type definitions
- Use descriptive channel names with namespaces (e.g., `myFeature:action`)

### 5. Window Management

- Use `isCache: true` for windows that should persist
- Implement proper cleanup in `onClose`
- Handle window lifecycle events appropriately
- Don't show windows until content is loaded (`show: false` + manual show)

### 6. Error Handling

- Always use try-catch in async operations
- Log errors appropriately
- Show user-friendly error messages
- Implement global error handlers (uncaughtException, unhandledRejection)

### 7. Type Safety

- Define all types in `types.ts` or global type definitions
- Use TypeScript strict mode
- Prefix types with `T` (e.g., `TUser`, `TConfig`)
- Export types for external use

### 8. Path Aliases

- Use `#main` for main process imports
- Use `#shared` for shared utilities
- Use relative paths only within the same module directory

---

## Common Patterns

### Singleton Pattern (Cached Window)

```
@WindowManager<TWindows["main"]>({
  hash: "window:main",
  isCache: true, // Window instance is reused
  options: { /* ... */ },
})
```

### Factory Pattern (Custom Providers)

```
{
  provide: MY_PROVIDER_TOKEN,
  useFactory: (service: SomeService): TMyProvider => ({
    method1: () => service.method1(),
    method2: (arg) => service.method2(arg),
  }),
  inject: [SomeService],
}
```

### Observer Pattern (Event Listeners)

```
constructor() {
  app.on("ready", () => this.handleReady());
  app.on("before-quit", () => this.handleQuit());
}
```

### Strategy Pattern (Platform-Specific Logic)

```
import { isPlatform } from "#shared/utils.js";

if (isPlatform("darwin")) {
  // macOS-specific logic
} else if (isPlatform("win32")) {
  // Windows-specific logic
}
```

---

## Module Bootstrap Order

Modules are bootstrapped in the order they appear in the array:

```
await bootstrapModules([
  AppPreloadModule, // 1. Preload window (splash screen)
  AppModule, // 2. Main application
  AuthModule, // 3. Authentication
  UserModule, // 4. User management
  NotificationModule, // 5. Notifications
  UpdaterModule, // 6. Auto-updater
  AppVersionModule, // 7. Version info
]);
```

**Important**:

- Dependencies should be bootstrapped before dependents
- Independent modules can be in any order
- Core modules (App, Menu, Tray) should come first

---

## Testing Considerations

### Service Testing

- Services should be pure and testable
- Mock injected dependencies
- Use dependency injection for easy mocking

### IPC Testing

- Test IPC handlers separately from business logic
- Mock window and webContents
- Validate input/output types

### Window Testing

- Test lifecycle methods independently
- Mock BrowserWindow
- Verify window options and behavior

---

## Summary

The main process architecture follows these principles:

1. **Modular Structure**: Each feature is a self-contained module
2. **Dependency Injection**: Services are injected, not instantiated
3. **Separation of Concerns**: Module, Service, IPC, Window are separate
4. **Type Safety**: Full TypeScript support with explicit types
5. **Extensibility**: Easy to add new modules following established patterns
6. **Testability**: Services and handlers are decoupled and testable

When creating new modules:

- Start with the simplest pattern (service-only)
- Add IPC when renderer communication is needed
- Add Window when UI is required
- Use tokens and factories for abstraction
- Follow existing naming and structure conventions

This architecture ensures maintainability, scalability, and clear organization of the Electron main process.
