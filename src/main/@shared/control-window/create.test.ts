import { BrowserWindow, app, session } from "electron";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { cacheWindows } from "./cache.js";
import { createWindow } from "./create.js";
import { getWindow } from "./receive.js";

vi.mock("electron", () => ({
  BrowserWindow: vi.fn(),
  session: {
    defaultSession: {
      webRequest: {
        onHeadersReceived: vi.fn(),
      },
    },
  },
  app: {
    getAppPath: vi.fn(),
  },
}));

vi.mock("./cache", () => ({
  cacheWindows: {
    has: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
  },
}));

vi.mock("./receive", () => ({
  getWindow: vi.fn(),
}));

vi.mock("../../config.js", () => ({
  folders: {
    distRenderer: "dist-renderer",
    distMain: "dist-main",
  },
  appName: "Test App",
}));

describe("createWindow", () => {
  const mockWindow = {
    show: vi.fn(),
    loadURL: vi.fn(),
    loadFile: vi.fn(),
    on: vi.fn(),
    hide: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (app.getAppPath as any).mockReturnValue("/app/path");
    (BrowserWindow as any).mockImplementation(() => mockWindow);

    process.env.BASE_REST_API = "https://api.example.com";
    process.env.LOCALHOST_PORT = "3000";
    process.env.NODE_ENV = "development";
  });

  afterEach(() => {
    delete process.env.BASE_REST_API;
    delete process.env.LOCALHOST_PORT;
    delete process.env.NODE_ENV;
  });

  describe("existing cached window", () => {
    it("should return existing window when hash exists in cache and isCache is true", () => {
      const hash = "main";
      const existingWindow = { ...mockWindow };

      (cacheWindows.has as any).mockReturnValue(true);
      (getWindow as any).mockReturnValue(existingWindow);

      const result = createWindow({
        hash,
        isCache: true,
      });

      expect(cacheWindows.has).toHaveBeenCalledWith(hash);
      expect(getWindow).toHaveBeenCalledWith(hash);
      expect(existingWindow.show).toHaveBeenCalled();
      expect(result).toBe(existingWindow);
      expect(BrowserWindow).not.toHaveBeenCalled();
    });

    it("should create new window when cached window does not exist", () => {
      const hash = "main";

      (cacheWindows.has as any).mockReturnValue(true);
      (getWindow as any).mockReturnValue(null);

      const result = createWindow({
        hash,
        isCache: true,
      });

      expect(BrowserWindow).toHaveBeenCalled();
      expect(result).toBe(mockWindow);
    });
  });

  describe("new window creation", () => {
    it("should create window with default webPreferences", () => {
      const hash = "settings";

      (cacheWindows.has as any).mockReturnValue(false);

      createWindow({ hash });

      const calls = (BrowserWindow as any).mock.calls[0][0];

      expect(calls).toHaveProperty("webPreferences");
      expect(calls.webPreferences.contextIsolation).toBe(true);
      expect(calls.webPreferences.nodeIntegration).toBe(false);
      expect(calls.webPreferences.preload).toBeDefined();
    });

    it("should merge custom options with defaults", () => {
      const options = {
        width: 800,
        height: 600,
        webPreferences: {
          devTools: false,
        },
      };

      createWindow({ options });

      expect(BrowserWindow).toHaveBeenCalledWith(
        expect.objectContaining({
          width: 800,
          height: 600,
          title: "Test App",
          webPreferences: expect.objectContaining({
            preload: expect.any(String),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: false,
          }),
        }),
      );
    });

    it("should use correct preload path in development", () => {
      process.env.NODE_ENV = "development";

      createWindow({ hash: "main" });

      const calls = (BrowserWindow as any).mock.calls;
      const webPreferences = calls[0][0].webPreferences;

      expect(webPreferences.preload).toBe(
        path.join("/app/path", "./dist-main/preload.cjs"),
      );
    });

    it("should use correct preload path in production", () => {
      process.env.NODE_ENV = "production";

      createWindow({ hash: "main" });

      const calls = (BrowserWindow as any).mock.calls;
      const webPreferences = calls[0][0].webPreferences;
      const expectedPath = path.join("/app/path", "../dist-main/preload.cjs");

      expect(path.normalize(webPreferences.preload)).toBe(
        path.normalize(expectedPath),
      );
    });
  });

  describe("CSP configuration", () => {
    it("should set CSP headers when isCache is true and no loadURL", () => {
      let capturedCallback: any;

      (
        session.defaultSession.webRequest.onHeadersReceived as any
      ).mockImplementation((callback: any) => {
        capturedCallback = callback;
      });

      createWindow({ hash: "main", isCache: true });

      expect(
        session.defaultSession.webRequest.onHeadersReceived,
      ).toHaveBeenCalled();

      const mockDetails = {
        responseHeaders: { "X-Custom": ["value"] },
      };
      const mockCallback = vi.fn();

      capturedCallback(mockDetails, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith({
        responseHeaders: {
          "X-Custom": ["value"],
          "Content-Security-Policy": [
            expect.stringContaining("default-src 'self'"),
          ],
        },
      });
    });

    it("should include BASE_REST_API in CSP when defined", () => {
      process.env.BASE_REST_API = "https://api.example.com";
      let capturedCallback: any;

      (
        session.defaultSession.webRequest.onHeadersReceived as any
      ).mockImplementation((callback: any) => {
        capturedCallback = callback;
      });

      createWindow({ hash: "main", isCache: true });

      const mockCallback = vi.fn();
      capturedCallback({ responseHeaders: {} }, mockCallback);

      const csp =
        mockCallback.mock.calls[0][0].responseHeaders[
          "Content-Security-Policy"
        ][0];

      expect(csp).toContain("connect-src 'self' https://api.example.com");
    });

    it("should not set CSP when loadURL is provided", () => {
      createWindow({
        hash: "main",
        isCache: true,
        loadURL: "https://example.com",
      });

      expect(
        session.defaultSession.webRequest.onHeadersReceived,
      ).not.toHaveBeenCalled();
    });
  });

  describe("URL loading", () => {
    it("should load custom URL when loadURL is provided", () => {
      const customURL = "https://example.com";

      createWindow({ loadURL: customURL });

      expect(mockWindow.loadURL).toHaveBeenCalledWith(customURL);
      expect(mockWindow.loadFile).not.toHaveBeenCalled();
    });

    it("should load localhost URL in development without loadURL", () => {
      process.env.NODE_ENV = "development";
      process.env.LOCALHOST_PORT = "3000";
      const hash = "settings";

      createWindow({ hash });

      expect(mockWindow.loadURL).toHaveBeenCalledWith(
        "http://localhost:3000#settings",
      );
    });

    it("should load localhost URL without hash in development", () => {
      process.env.NODE_ENV = "development";
      process.env.LOCALHOST_PORT = "3000";

      createWindow({});

      expect(mockWindow.loadURL).toHaveBeenCalledWith("http://localhost:3000");
    });

    it("should load file in production with hash", () => {
      process.env.NODE_ENV = "production";
      const hash = "main";

      createWindow({ hash });

      const calls = (mockWindow.loadFile as any).mock.calls[0];
      const receivedPath = calls[0];
      const expectedPath = path.join("/app/path", "/dist-renderer/index.html");

      expect(path.normalize(receivedPath)).toBe(path.normalize(expectedPath));
      expect(calls[1]).toEqual({ hash });
    });

    it("should warn when LOCALHOST_PORT is missing in development", () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});
      delete process.env.LOCALHOST_PORT;
      process.env.NODE_ENV = "development";

      createWindow({ hash: "main" });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("process.env.LOCALHOST_PORT"),
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe("window caching", () => {
    it("should cache window when hash and isCache are provided", () => {
      const hash = "main";

      createWindow({ hash, isCache: true });

      expect(cacheWindows.set).toHaveBeenCalledWith(hash, mockWindow);
    });

    it("should not cache window when isCache is false", () => {
      const hash = "main";

      createWindow({ hash, isCache: false });

      expect(cacheWindows.set).not.toHaveBeenCalled();
    });

    it("should add close event listener to hide window when cached", () => {
      const hash = "main";

      (cacheWindows.has as any).mockReturnValue(true);
      (cacheWindows.get as any).mockReturnValue(mockWindow);

      createWindow({ hash, isCache: true });

      expect(mockWindow.on).toHaveBeenCalledWith("close", expect.any(Function));
    });

    it("should prevent default and hide window on close event", () => {
      const hash = "main";
      const mockEvent = { preventDefault: vi.fn() };

      (cacheWindows.has as any).mockReturnValue(true);
      (cacheWindows.get as any).mockReturnValue(mockWindow);

      createWindow({ hash, isCache: true });

      const closeHandler = (mockWindow.on as any).mock.calls.find(
        (call: any) => call[0] === "close",
      )?.[1];

      closeHandler(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockWindow.hide).toHaveBeenCalled();
    });

    it("should not add close listener when window not in cache after set", () => {
      const hash = "main";

      (cacheWindows.has as any)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false);

      createWindow({ hash, isCache: true });

      expect(cacheWindows.set).toHaveBeenCalledWith(hash, mockWindow);
      expect(mockWindow.on).not.toHaveBeenCalled();
    });
  });

  describe("return value", () => {
    it("should return created window instance", () => {
      const result = createWindow({ hash: "main" });

      expect(result).toBe(mockWindow);
    });

    it("should return window without hash parameter", () => {
      const result = createWindow({});

      expect(result).toBe(mockWindow);
      expect(BrowserWindow).toHaveBeenCalled();
    });
  });
});
