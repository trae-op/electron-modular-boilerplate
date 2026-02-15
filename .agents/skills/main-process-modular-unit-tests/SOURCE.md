# Electron Main Process Unit Testing Guide with Vitest

## Overview

This comprehensive guide provides AI agents with detailed instructions for creating unit tests for Electron main process applications using Vitest. The guide covers testing modular architectures built with `@devisfuture/electron-modular`, dependency injection patterns, IPC handlers, services, and Electron-specific APIs.

## Table of Contents

1. [Architecture Understanding](#architecture-understanding)
2. [Setup and Configuration](#setup-and-configuration)
3. [Testing Patterns](#testing-patterns)
4. [Best Practices](#best-practices)
5. [Complete Examples](#complete-examples)

---

## Architecture Understanding

### Modular Structure

The main process follows a modular architecture with these components:

```architecture
src/main/
├── @shared/           # Shared utilities, logger, IPC helpers, store
├── app/              # Main application module (IPC, Service, Window)
├── auth/             # Authentication module
├── user/             # User management module
├── rest-api/         # HTTP client module
├── notification/     # Notification module
├── updater/          # Auto-updater module
└── tray/            # System tray module
```

### Key Components

Each module typically contains:

- **Module (`module.ts`)**: Dependency injection container configuration
- **Service (`service.ts`)**: Business logic implementation
- **IPC Handler (`ipc.ts`)**: Inter-process communication handlers
- **Window (`window.ts`)**: Window management logic
- **Types (`types.ts`)**: TypeScript type definitions
- **Tokens (`tokens.ts`)**: Dependency injection tokens

---

## Setup and Configuration

### Install Dependencies

Ensure these packages are in `package.json`:

```
{
  "devDependencies": {
    "vitest": "^3.1.1",
    "@types/node": "^22.13.14"
  },
  "scripts": {
    "test:unit:main": "vitest src/main --watch=false"
  }
}
```

### Create Vitest Config for Main Process

Create `vitest.config.main.ts` in the root:

```
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/main/**/*.test.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/main/**/*.ts"],
      exclude: [
        "src/main/**/*.test.ts",
        "src/main/**/*.d.ts",
        "src/main/app.ts",
        "src/main/preload.cts",
      ],
    },
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
  },
  resolve: {
    alias: {
      "#shared": path.resolve(__dirname, "./src/main/@shared"),
      "#main": path.resolve(__dirname, "./src/main"),
    },
  },
});
```

### Update package.json Scripts

```
{
  "scripts": {
    "test:main": "vitest src/main",
    "test:main:ui": "vitest src/main --ui",
    "test:main:coverage": "vitest src/main --coverage"
  }
}
```

---

## Testing Patterns

### 1. Testing Services

Services contain business logic and dependencies. Mock external dependencies.

#### Pattern: Service with Dependency Injection

```
// user/service.test.ts
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UserService } from "./service.js";
import type { TUserRestApiProvider } from "./types.js";

describe("UserService", () => {
  let userService: UserService;
  let mockRestApiProvider: TUserRestApiProvider;

  beforeEach(() => {
    // Create mock provider
    mockRestApiProvider = {
      get: vi.fn(),
    };

    // Instantiate service with mocked dependency
    userService = new UserService(mockRestApiProvider);
  });

  describe("byId", () => {
    it("should fetch user by id successfully", async () => {
      const mockUser = {
        id: "user-123",
        name: "John Doe",
        email: "john@example.com",
      };

      // Mock successful API response
      vi.mocked(mockRestApiProvider.get).mockResolvedValue({
        status: 200,
        data: mockUser,
        error: undefined,
      });

      const result = await userService.byId("user-123");

      expect(result).toEqual(mockUser);
      expect(mockRestApiProvider.get).toHaveBeenCalledWith(
        expect.stringContaining("/user/user-123"),
        expect.objectContaining({
          isCache: true,
        }),
      );
    });

    it("should return undefined when API returns error", async () => {
      // Mock error response
      vi.mocked(mockRestApiProvider.get).mockResolvedValue({
        status: 404,
        data: undefined,
        error: { message: "User not found" },
      });

      const result = await userService.byId("user-999");

      expect(result).toBeUndefined();
    });

    it("should include authorization header when token exists", async () => {
      // Mock electron-store to return auth token
      vi.mock("#shared/store.js", () => ({
        getElectronStorage: vi.fn((key: string) => {
          if (key === "authToken") return "mock-token-123";
          return undefined;
        }),
      }));

      vi.mocked(mockRestApiProvider.get).mockResolvedValue({
        status: 200,
        data: { id: "1" },
        error: undefined,
      });

      await userService.byId("1");

      expect(mockRestApiProvider.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer mock-token-123",
          }),
        }),
      );
    });
  });
});
```

#### Pattern: Service with Electron APIs

```
// auth/service.test.ts
import { BrowserWindow } from "electron";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthService } from "./service.js";

// Mock Electron modules
vi.mock("electron", () => ({
  BrowserWindow: vi.fn(),
}));

// Mock shared modules
vi.mock("#shared/store.js", () => ({
  deleteFromElectronStorage: vi.fn(),
  deleteStore: vi.fn(),
}));

vi.mock("#shared/ipc/ipc.js", () => ({
  ipcWebContentsSend: vi.fn(),
}));

describe("AuthService", () => {
  let authService: AuthService;
  let mockWindow: any;

  beforeEach(() => {
    authService = new AuthService();

    // Create mock BrowserWindow
    mockWindow = {
      webContents: {
        send: vi.fn(),
      },
    };
  });

  describe("logout", () => {
    it("should clear all auth data and notify renderer", async () => {
      const { deleteFromElectronStorage, deleteStore } =
        await import("#shared/store.js");
      const { ipcWebContentsSend } = await import("#shared/ipc/ipc.js");

      authService.logout(mockWindow as BrowserWindow);

      // Verify storage cleanup
      expect(deleteFromElectronStorage).toHaveBeenCalledWith("authToken");
      expect(deleteFromElectronStorage).toHaveBeenCalledWith("response");
      expect(deleteFromElectronStorage).toHaveBeenCalledWith("userId");
      expect(deleteStore).toHaveBeenCalledWith("masterKey");

      // Verify IPC notification
      expect(ipcWebContentsSend).toHaveBeenCalledWith(
        "auth",
        mockWindow.webContents,
        { isAuthenticated: false },
      );
    });
  });
});
```

### 2. Testing IPC Handlers

IPC handlers manage communication between main and renderer processes.

#### Pattern: Testing IpcHandler Class

```
// app/ipc.test.ts
import { app, dialog } from "electron";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AppIpc } from "./ipc.js";
import { AppService } from "./service.js";

vi.mock("electron", () => ({
  app: {
    on: vi.fn(),
  },
  dialog: {
    showMessageBox: vi.fn(),
  },
}));

vi.mock("#shared/ipc/ipc.js", () => ({
  ipcMainOn: vi.fn(),
}));

describe("AppIpc", () => {
  let appIpc: AppIpc;
  let mockAppService: AppService;

  beforeEach(() => {
    mockAppService = {
      destroyTrayAndWindows: vi.fn(),
      dockHide: vi.fn(),
    } as any;

    // Reset process event listeners
    process.removeAllListeners("uncaughtException");
    process.removeAllListeners("unhandledRejection");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should register error handlers on construction", () => {
    appIpc = new AppIpc(mockAppService);

    expect(app.on).toHaveBeenCalledWith(
      "render-process-gone",
      expect.any(Function),
    );
  });

  it("should handle uncaught exceptions", () => {
    appIpc = new AppIpc(mockAppService);

    const error = new Error("Test error");
    process.emit("uncaughtException", error);

    expect(mockAppService.destroyTrayAndWindows).toHaveBeenCalled();
    expect(mockAppService.dockHide).toHaveBeenCalled();
    expect(dialog.showMessageBox).toHaveBeenCalledWith(
      expect.objectContaining({
        message: error.message,
      }),
    );
  });

  it("should handle unhandled promise rejections", () => {
    appIpc = new AppIpc(mockAppService);

    const reason = "Promise rejection reason";
    process.emit("unhandledRejection", reason);

    expect(mockAppService.destroyTrayAndWindows).toHaveBeenCalled();
    expect(dialog.showMessageBox).toHaveBeenCalled();
  });

  describe("onInit", () => {
    it("should create main window and register IPC listeners", async () => {
      const mockWindow = {
        show: vi.fn(),
      };

      const mockMainWindow = {
        create: vi.fn().mockResolvedValue(mockWindow),
      };

      const getWindow = vi.fn().mockReturnValue(mockMainWindow);

      appIpc = new AppIpc(mockAppService);
      await appIpc.onInit({ getWindow });

      expect(getWindow).toHaveBeenCalledWith("window:main");
      expect(mockMainWindow.create).toHaveBeenCalled();
    });
  });
});
```

#### Pattern: Testing IPC Communication Functions

```
// @shared/ipc/ipc.test.ts
import { ipcMain } from "electron";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ipcMainHandle, ipcMainOn, validateEventFrame } from "./ipc.js";

vi.mock("electron", () => ({
  ipcMain: {
    handle: vi.fn(),
    on: vi.fn(),
  },
}));

describe("IPC Helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ipcMainHandle", () => {
    it("should register IPC handler and validate frame", async () => {
      const mockHandler = vi.fn().mockResolvedValue({ success: true });
      const mockFrame = {
        url: "file:///window:main#/",
      };

      const mockEvent = {
        senderFrame: mockFrame,
      };

      ipcMainHandle("getAppVersion", mockHandler);

      expect(ipcMain.handle).toHaveBeenCalledWith(
        "getAppVersion",
        expect.any(Function),
      );

      // Simulate IPC call
      const registeredHandler = vi.mocked(ipcMain.handle).mock.calls[0][1];
      const result = await registeredHandler(mockEvent, "test-payload");

      expect(mockHandler).toHaveBeenCalledWith("test-payload");
      expect(result).toEqual({ success: true });
    });

    it("should throw error for invalid frame", async () => {
      const mockHandler = vi.fn();
      const mockEvent = {
        senderFrame: null,
      };

      ipcMainHandle("testEvent", mockHandler);

      const registeredHandler = vi.mocked(ipcMain.handle).mock.calls[0][1];

      await expect(registeredHandler(mockEvent, undefined)).rejects.toThrow(
        "Invalid frame: Frame is null",
      );
    });
  });

  describe("validateEventFrame", () => {
    it("should allow valid file protocol frames", () => {
      const mockFrame = {
        url: "file:///window:main#/",
      };

      expect(() => validateEventFrame(mockFrame as any)).not.toThrow();
    });

    it("should allow localhost in development mode", () => {
      process.env.NODE_ENV = "development";
      process.env.LOCALHOST_ELECTRON_SERVER_PORT = "8844";

      const mockFrame = {
        url: "http://localhost:8844/",
      };

      expect(() => validateEventFrame(mockFrame as any)).not.toThrow();
    });

    it("should reject unauthorized frames", () => {
      const mockFrame = {
        url: "https://evil.com/",
      };

      expect(() => validateEventFrame(mockFrame as any)).toThrow(
        "unauthorized frame",
      );
    });
  });
});
```

### 3. Testing Modules

Test module configuration and dependency injection setup.

```
// user/module.test.ts
import { describe, expect, it } from "vitest";

import { UserIpc } from "./ipc.js";
import { UserModule } from "./module.js";
import { UserService } from "./service.js";
import { USER_REST_API_PROVIDER } from "./tokens.js";

describe("UserModule", () => {
  it("should be defined", () => {
    expect(UserModule).toBeDefined();
  });

  it("should have correct module metadata", () => {
    const metadata = Reflect.getMetadata("module", UserModule);

    expect(metadata).toBeDefined();
    expect(metadata.ipc).toContain(UserIpc);
    expect(metadata.providers).toEqual(
      expect.arrayContaining([
        UserService,
        expect.objectContaining({
          provide: USER_REST_API_PROVIDER,
        }),
      ]),
    );
  });
});
```

### 4. Testing REST API Service

```
// rest-api/service.test.ts
import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RestApiService } from "./service.js";

vi.mock("axios");

describe("RestApiService", () => {
  let restApiService: RestApiService;

  beforeEach(() => {
    const mockAxiosInstance = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    };

    vi.mocked(axios.create).mockReturnValue(mockAxiosInstance as any);

    restApiService = new RestApiService();
  });

  describe("get", () => {
    it("should make GET request and return data", async () => {
      const mockData = { id: 1, name: "Test" };
      const mockResponse = {
        status: 200,
        data: mockData,
      };

      const axiosInstance = axios.create();
      vi.mocked(axiosInstance.get).mockResolvedValue(mockResponse);

      const result = await restApiService.get("/test");

      expect(result).toEqual({
        status: 200,
        data: mockData,
        error: undefined,
      });
    });

    it("should cache response when isCache is true", async () => {
      const mockData = { id: 1 };
      const mockResponse = { status: 200, data: mockData };

      const axiosInstance = axios.create();
      vi.mocked(axiosInstance.get).mockResolvedValue(mockResponse);

      await restApiService.get("/test", { isCache: true });

      // Verify caching logic (you'll need to expose or test caching behavior)
    });

    it("should handle network errors", async () => {
      const axiosInstance = axios.create();
      vi.mocked(axiosInstance.get).mockRejectedValue({
        request: {},
        message: "Network Error",
      });

      const result = await restApiService.get("/test");

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain("No response received");
    });

    it("should handle HTTP errors", async () => {
      const axiosInstance = axios.create();
      vi.mocked(axiosInstance.get).mockRejectedValue({
        response: {
          status: 404,
          data: { message: "Not found" },
        },
        message: "Request failed",
        code: "ERR_BAD_REQUEST",
      });

      const result = await restApiService.get("/test");

      expect(result.status).toBe(404);
      expect(result.error).toBeDefined();
    });
  });
});
```

### 5. Testing Utility Functions

```
// @shared/utils.test.ts
import { beforeEach, describe, expect, it } from "vitest";

import { isDev, isPlatform } from "./utils.js";

describe("Utility Functions", () => {
  describe("isDev", () => {
    const originalEnv = process.env.NODE_ENV;

    beforeEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it("should return true when NODE_ENV is development", () => {
      process.env.NODE_ENV = "development";
      expect(isDev()).toBe(true);
    });

    it("should return false when NODE_ENV is production", () => {
      process.env.NODE_ENV = "production";
      expect(isDev()).toBe(false);
    });
  });

  describe("isPlatform", () => {
    it("should return true for current platform", () => {
      const currentPlatform = process.platform;
      expect(isPlatform(currentPlatform)).toBe(true);
    });

    it("should return false for different platform", () => {
      const otherPlatform = process.platform === "win32" ? "darwin" : "win32";
      expect(isPlatform(otherPlatform)).toBe(false);
    });
  });
});
```

### 6. Testing Store/Storage

```
// @shared/store.test.ts
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearStore,
  deleteStore,
  getElectronStorage,
  getStore,
  hasStore,
  setElectronStorage,
  setStore,
} from "./store.js";

// Mock electron-store
vi.mock("electron-store", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      get: vi.fn(),
      set: vi.fn(),
      has: vi.fn(),
      delete: vi.fn(),
      clear: vi.fn(),
    })),
  };
});

describe("Store", () => {
  beforeEach(() => {
    clearStore();
  });

  describe("In-Memory Store", () => {
    it("should set and get values", () => {
      setStore("testKey", "testValue");
      expect(getStore("testKey")).toBe("testValue");
    });

    it("should check if key exists", () => {
      setStore("testKey", "value");
      expect(hasStore("testKey")).toBe(true);
      expect(hasStore("nonExistent")).toBe(false);
    });

    it("should delete values", () => {
      setStore("testKey", "value");
      deleteStore("testKey");
      expect(hasStore("testKey")).toBe(false);
    });

    it("should clear all values", () => {
      setStore("key1", "value1");
      setStore("key2", "value2");
      clearStore();
      expect(hasStore("key1")).toBe(false);
      expect(hasStore("key2")).toBe(false);
    });
  });

  describe("Electron Storage", () => {
    it("should interact with electron-store", () => {
      // Test electron storage functions
      setElectronStorage("authToken", "token-123");
      // Note: Since electron-store is mocked, verify mock calls
    });
  });
});
```

---

## Best Practices

### 1. Mock External Dependencies

Always mock Electron APIs and external modules:

```
// Mock Electron
vi.mock("electron", () => ({
  app: {
    on: vi.fn(),
    quit: vi.fn(),
    getPath: vi.fn().mockReturnValue("/mock/path"),
  },
  BrowserWindow: vi.fn(),
  ipcMain: {
    handle: vi.fn(),
    on: vi.fn(),
  },
  dialog: {
    showMessageBox: vi.fn(),
  },
}));

// Mock electron-store
vi.mock("electron-store", () => ({
  default: vi.fn().mockImplementation(() => ({
    get: vi.fn(),
    set: vi.fn(),
  })),
}));

// Mock electron-log
vi.mock("electron-log", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    transports: {
      file: { format: "", level: "info", maxSize: 0 },
      console: { format: "", level: "info" },
    },
  },
}));
```

### 2. Test Isolation

Each test should be independent:

```
describe("Service", () => {
  let service: MyService;
  let mockDependency: MockType;

  beforeEach(() => {
    // Fresh instances for each test
    mockDependency = createMock();
    service = new MyService(mockDependency);
  });

  afterEach(() => {
    vi.clearAllMocks(); // Clear mock history
    vi.restoreAllMocks(); // Restore original implementations
  });
});
```

### 3. Test Coverage Requirements

Aim for comprehensive coverage:

- **Services**: 80-90% coverage
  - All public methods
  - Error handling paths
  - Edge cases
- **IPC Handlers**: 100% coverage
  - All event handlers
  - Frame validation
  - Error scenarios

- **Utilities**: 100% coverage
  - All branches
  - All edge cases

### 4. Descriptive Test Names

Use clear, descriptive test names:

```
// ✅ Good
it("should return user data when API request succeeds", () => {});
it("should throw error when token is missing", () => {});
it("should cache response when isCache flag is true", () => {});

// ❌ Bad
it("works", () => {});
it("test1", () => {});
it("handles error", () => {});
```

### 5. Arrange-Act-Assert Pattern

Structure tests clearly:

```
it("should fetch user by id successfully", async () => {
  // Arrange - Set up test data and mocks
  const userId = "user-123";
  const mockUser = { id: userId, name: "John" };
  vi.mocked(mockApi.get).mockResolvedValue({
    data: mockUser,
    error: undefined,
  });

  // Act - Execute the function under test
  const result = await userService.byId(userId);

  // Assert - Verify the results
  expect(result).toEqual(mockUser);
  expect(mockApi.get).toHaveBeenCalledWith(
    expect.stringContaining(userId),
    expect.any(Object),
  );
});
```

### 6. Test Error Scenarios

Always test error paths:

```
describe("Error Handling", () => {
  it("should handle network timeout", async () => {
    vi.mocked(api.get).mockRejectedValue(new Error("Timeout"));

    const result = await service.fetchData();

    expect(result.error).toBeDefined();
  });

  it("should handle invalid input", () => {
    expect(() => service.process(null)).toThrow("Invalid input");
  });

  it("should return fallback when data is unavailable", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: null });

    const result = await service.getData();

    expect(result).toEqual(DEFAULT_DATA);
  });
});
```

### 7. Mock IPC Communication

```
describe("IPC Communication", () => {
  it("should send message to renderer", () => {
    const mockWebContents = {
      send: vi.fn(),
    };

    ipcWebContentsSend("testEvent", mockWebContents as any, {
      data: "test",
    });

    expect(mockWebContents.send).toHaveBeenCalledWith("testEvent", {
      data: "test",
    });
  });
});
```

### 8. Test Async Operations

Use async/await and proper assertions:

```
it("should handle async operations", async () => {
  const promise = service.asyncMethod();

  // Test promise state
  expect(promise).toBeInstanceOf(Promise);

  // Await result
  const result = await promise;

  expect(result).toBeDefined();
});

it("should handle concurrent requests", async () => {
  const promises = [service.fetch("1"), service.fetch("2"), service.fetch("3")];

  const results = await Promise.all(promises);

  expect(results).toHaveLength(3);
});
```

### 9. Test Window Management

```
// window.test.ts
import { BrowserWindow } from "electron";
import { describe, expect, it, vi } from "vitest";

vi.mock("electron");

describe("Window Management", () => {
  it("should create window with correct options", () => {
    const mockWindow = {
      loadURL: vi.fn(),
      on: vi.fn(),
    };

    vi.mocked(BrowserWindow).mockReturnValue(mockWindow as any);

    const windowManager = new WindowManager();
    windowManager.createWindow();

    expect(BrowserWindow).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 800,
        height: 600,
        webPreferences: expect.objectContaining({
          nodeIntegration: false,
          contextIsolation: true,
        }),
      }),
    );
  });
});
```

### 10. Environment-Specific Tests

```
describe("Environment-specific behavior", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it("should behave differently in development", () => {
    process.env.NODE_ENV = "development";
    expect(service.getLogLevel()).toBe("debug");
  });

  it("should behave differently in production", () => {
    process.env.NODE_ENV = "production";
    expect(service.getLogLevel()).toBe("info");
  });
});
```

---

## Complete Examples

### Example 1: Complete Service Test Suite

```
// user/service.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { UserService } from "./service.js";
import type { TUserRestApiProvider } from "./types.js";

// Mock dependencies
vi.mock("#shared/store.js", () => ({
  getElectronStorage: vi.fn(),
}));

describe("UserService", () => {
  let userService: UserService;
  let mockRestApiProvider: TUserRestApiProvider;

  beforeEach(() => {
    mockRestApiProvider = {
      get: vi.fn(),
    };

    userService = new UserService(mockRestApiProvider);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("byId", () => {
    it("should fetch user by id successfully with auth token", async () => {
      // Arrange
      const userId = "user-123";
      const mockToken = "bearer-token-xyz";
      const mockUser = {
        id: userId,
        name: "Jane Doe",
        email: "jane@example.com",
      };

      const { getElectronStorage } = await import("#shared/store.js");
      vi.mocked(getElectronStorage).mockReturnValue(mockToken);

      vi.mocked(mockRestApiProvider.get).mockResolvedValue({
        status: 200,
        data: mockUser,
        error: undefined,
      });

      // Act
      const result = await userService.byId(userId);

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockRestApiProvider.get).toHaveBeenCalledTimes(1);
      expect(mockRestApiProvider.get).toHaveBeenCalledWith(
        expect.stringContaining(`/user/${userId}`),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`,
            "Content-Type": "application/json",
          }),
          isCache: true,
        }),
      );
    });

    it("should fetch user without auth header when token is missing", async () => {
      // Arrange
      const userId = "user-456";
      const mockUser = { id: userId, name: "Public User" };

      const { getElectronStorage } = await import("#shared/store.js");
      vi.mocked(getElectronStorage).mockReturnValue(undefined);

      vi.mocked(mockRestApiProvider.get).mockResolvedValue({
        status: 200,
        data: mockUser,
        error: undefined,
      });

      // Act
      const result = await userService.byId(userId);

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockRestApiProvider.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: undefined,
        }),
      );
    });

    it("should return undefined when API returns error", async () => {
      // Arrange
      vi.mocked(mockRestApiProvider.get).mockResolvedValue({
        status: 404,
        data: undefined,
        error: { message: "User not found" },
      });

      // Act
      const result = await userService.byId("nonexistent");

      // Assert
      expect(result).toBeUndefined();
    });

    it("should return undefined when API throws exception", async () => {
      // Arrange
      vi.mocked(mockRestApiProvider.get).mockRejectedValue(
        new Error("Network error"),
      );

      // Act & Assert
      await expect(userService.byId("user-789")).rejects.toThrow(
        "Network error",
      );
    });

    it("should cache successful responses", async () => {
      // Arrange
      const mockUser = { id: "1", name: "Cached User" };
      vi.mocked(mockRestApiProvider.get).mockResolvedValue({
        status: 200,
        data: mockUser,
        error: undefined,
      });

      // Act
      await userService.byId("1");

      // Assert
      expect(mockRestApiProvider.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          isCache: true,
        }),
      );
    });
  });
});
```

### Example 2: Complete IPC Handler Test Suite

```
// notification/ipc.test.ts
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NotificationIpc } from "./ipc.js";
import { NotificationService } from "./service.js";

vi.mock("electron", () => ({
  ipcMain: {
    handle: vi.fn(),
  },
}));

vi.mock("#shared/ipc/ipc.js", () => ({
  ipcMainHandle: vi.fn((channel, handler) => {
    // Store handler for testing
    (global as any).ipcHandlers = (global as any).ipcHandlers || {};
    (global as any).ipcHandlers[channel] = handler;
  }),
}));

describe("NotificationIpc", () => {
  let notificationIpc: NotificationIpc;
  let mockNotificationService: NotificationService;

  beforeEach(() => {
    mockNotificationService = {
      show: vi.fn(),
      clear: vi.fn(),
    } as any;

    notificationIpc = new NotificationIpc(mockNotificationService);
  });

  describe("onInit", () => {
    it("should register IPC handlers", () => {
      const { ipcMainHandle } = require("#shared/ipc/ipc.js");

      notificationIpc.onInit();

      expect(ipcMainHandle).toHaveBeenCalledWith(
        "showNotification",
        expect.any(Function),
      );
      expect(ipcMainHandle).toHaveBeenCalledWith(
        "clearNotification",
        expect.any(Function),
      );
    });

    it("should handle showNotification event", async () => {
      const mockPayload = {
        title: "Test Notification",
        body: "Test message",
      };

      notificationIpc.onInit();

      const handler = (global as any).ipcHandlers.showNotification;
      await handler(mockPayload);

      expect(mockNotificationService.show).toHaveBeenCalledWith(mockPayload);
    });

    it("should handle clearNotification event", async () => {
      notificationIpc.onInit();

      const handler = (global as any).ipcHandlers.clearNotification;
      await handler();

      expect(mockNotificationService.clear).toHaveBeenCalled();
    });
  });
});
```

### Example 3: Testing with Dependency Injection

```
// Complete example showing DI testing
import { Container } from "@devisfuture/electron-modular";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RestApiService } from "#main/rest-api/service.js";

import { UserModule } from "./module.js";
import { UserService } from "./service.js";
import { USER_REST_API_PROVIDER } from "./tokens.js";

describe("UserModule Integration", () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  it("should provide UserService with dependencies", () => {
    // Bootstrap module
    container.register(UserModule);

    // Resolve service
    const userService = container.resolve(UserService);

    expect(userService).toBeInstanceOf(UserService);
  });

  it("should inject REST API provider into UserService", () => {
    const mockRestApiService = {
      get: vi.fn(),
    };

    container.register({
      provide: RestApiService,
      useValue: mockRestApiService,
    });

    container.register(UserModule);

    const userService = container.resolve(UserService);
    const provider = container.resolve(USER_REST_API_PROVIDER);

    expect(provider).toBeDefined();
    expect(provider.get).toBe(mockRestApiService.get);
  });
});
```

---

## Testing Checklist for AI Agents

When creating unit tests for Electron main process, ensure:

### ✅ Setup

- [ ] Vitest configuration created with correct aliases
- [ ] All Electron modules mocked
- [ ] Test files named with `.test.ts` extension
- [ ] Tests placed alongside source files or in `__tests__` folders

### ✅ Service Tests

- [ ] All public methods tested
- [ ] Dependency injection mocked correctly
- [ ] Success cases covered
- [ ] Error cases covered
- [ ] Edge cases handled
- [ ] Authorization headers tested
- [ ] Caching behavior verified

### ✅ IPC Handler Tests

- [ ] All IPC channels registered
- [ ] Event validation tested
- [ ] Frame security checked
- [ ] Error handling verified
- [ ] Window communication tested

### ✅ Module Tests

- [ ] Module metadata verified
- [ ] Providers configuration checked
- [ ] Imports validated
- [ ] Dependency injection tokens tested

### ✅ Utility Tests

- [ ] All branches covered
- [ ] Platform-specific logic tested
- [ ] Environment variables handled
- [ ] Type guards validated

### ✅ Best Practices

- [ ] Descriptive test names used
- [ ] Arrange-Act-Assert pattern followed
- [ ] Tests are isolated and independent
- [ ] Mocks cleaned up in afterEach
- [ ] Async operations properly awaited
- [ ] Coverage threshold met (80%+)

---

## Common Patterns Summary

### Pattern 1: Service with Injected Dependency

```
class MyService {
  constructor(@Inject(TOKEN) private dependency: Type) {}
}

// Test
const mockDependency = createMock();
const service = new MyService(mockDependency);
```

### Pattern 2: IPC Handler

```
@IpcHandler()
class MyIpc {
  onInit() {
    ipcMainHandle("event", handler);
  }
}

// Test
vi.mock("#shared/ipc/ipc.js");
const ipc = new MyIpc(mockService);
ipc.onInit();
expect(ipcMainHandle).toHaveBeenCalled();
```

### Pattern 3: Async Service Method

```
async fetchData(): Promise<Data> {
  const response = await this.api.get(url);
  return response.data;
}

// Test
it("should fetch data", async () => {
  vi.mocked(api.get).mockResolvedValue({ data: mockData });
  const result = await service.fetchData();
  expect(result).toEqual(mockData);
});
```

### Pattern 4: Error Handling

```
try {
  return await operation();
} catch (error) {
  return { error };
}

// Test
it("should handle errors", async () => {
  vi.mocked(operation).mockRejectedValue(new Error("Failed"));
  const result = await service.doSomething();
  expect(result.error).toBeDefined();
});
```

---

## Conclusion

This guide provides comprehensive patterns for testing Electron main process applications using Vitest. AI agents should:

1. **Always mock Electron APIs** - Never run actual Electron in tests
2. **Test in isolation** - Each test should be independent
3. **Cover all scenarios** - Success, failure, and edge cases
4. **Use descriptive names** - Tests should document behavior
5. **Follow AAA pattern** - Arrange, Act, Assert
6. **Verify mock calls** - Ensure dependencies are called correctly
7. **Test async properly** - Use async/await consistently
8. **Achieve high coverage** - Aim for 80%+ code coverage
