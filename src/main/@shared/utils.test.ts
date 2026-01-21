import type { WebFrameMain } from "electron";
import { afterEach, describe, expect, it, vi } from "vitest";

import { isDev, isPlatform, validateEventFrame } from "./utils.js";

vi.mock("../config.js", () => ({
  windows: {
    main: "window:main",
    auth: "window:auth",
  },
}));

const originalNodeEnv = process.env.NODE_ENV;
const originalLocalhostPort = process.env.LOCALHOST_PORT;
const originalElectronServerPort = process.env.LOCALHOST_ELECTRON_SERVER_PORT;

afterEach(() => {
  if (originalNodeEnv === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = originalNodeEnv;
  }

  if (originalLocalhostPort === undefined) {
    delete process.env.LOCALHOST_PORT;
  } else {
    process.env.LOCALHOST_PORT = originalLocalhostPort;
  }

  if (originalElectronServerPort === undefined) {
    delete process.env.LOCALHOST_ELECTRON_SERVER_PORT;
  } else {
    process.env.LOCALHOST_ELECTRON_SERVER_PORT = originalElectronServerPort;
  }
});

const createFrame = (url: string): WebFrameMain => {
  return { url } as unknown as WebFrameMain;
};

describe("isDev", () => {
  it("returns true when NODE_ENV is set to development", () => {
    process.env.NODE_ENV = "development";

    expect(isDev()).toBe(true);
  });

  it("returns false when NODE_ENV is not development", () => {
    process.env.NODE_ENV = "production";

    expect(isDev()).toBe(false);
  });
});

describe("isPlatform", () => {
  it("returns true for the current process platform", () => {
    expect(isPlatform(process.platform)).toBe(true);
  });

  it("returns false for a different platform", () => {
    const alternativePlatform =
      process.platform === "win32" ? "linux" : "win32";

    expect(isPlatform(alternativePlatform)).toBe(false);
  });
});

describe("validateEventFrame", () => {
  it("throws an error when frame is null", () => {
    expect(() => validateEventFrame(null)).toThrowError(
      new Error("Invalid frame: Frame is null"),
    );
  });

  it("allows dev localhost frames when host is whitelisted", () => {
    process.env.NODE_ENV = "development";
    process.env.LOCALHOST_PORT = "5173";

    const frame = createFrame("http://localhost:5173/#/window:main");

    expect(() => validateEventFrame(frame)).not.toThrow();
  });

  it("allows file protocol frames containing a known window identifier", () => {
    process.env.NODE_ENV = "production";
    delete process.env.LOCALHOST_PORT;

    const frame = createFrame("file:///C:/app/index.html#window:main");

    expect(() => validateEventFrame(frame)).not.toThrow();
  });

  it("throws for file protocol frames with unauthorized hashes", () => {
    process.env.NODE_ENV = "production";

    const frame = createFrame("file:///C:/app/index.html#/unauthorized");

    expect(() => validateEventFrame(frame)).toThrowError(
      new Error(
        "The event is from an unauthorized frame: file:///C:/app/index.html#/unauthorized",
      ),
    );
  });

  it("throws for non-file protocol frames without hash routes", () => {
    process.env.NODE_ENV = "production";

    const frame = createFrame("https://example.com");

    expect(() => validateEventFrame(frame)).toThrowError(
      new Error("The event is from an unauthorized frame: https://example.com"),
    );
  });

  it("allows file protocol frames without hash", () => {
    process.env.NODE_ENV = "production";

    const frame = createFrame("file:///C:/app/index.html");

    expect(() => validateEventFrame(frame)).not.toThrow();
  });
});
