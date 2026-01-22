import { describe, expect, it, vi } from "vitest";

type TTransport = {
  format?: string;
  level?: string;
  maxSize?: number;
};

describe("@shared/logger", () => {
  it("configures transports for development", async () => {
    process.env.NODE_ENV = "development";
    vi.resetModules();

    const fileTransport: TTransport = {};
    const consoleTransport: TTransport = {};

    vi.doMock("electron-log", () => ({
      default: {
        info: vi.fn(),
        transports: {
          file: fileTransport,
          console: consoleTransport,
        },
      },
    }));

    const { logger } = await import("./logger.js");

    expect(logger).toBeDefined();
    expect(fileTransport.level).toBe("info");
    expect(consoleTransport.level).toBe("debug");
    expect(fileTransport.maxSize).toBe(5 * 1024 * 1024);
  });

  it("configures transports for production", async () => {
    process.env.NODE_ENV = "production";
    vi.resetModules();

    const fileTransport: TTransport = {};
    const consoleTransport: TTransport = {};

    vi.doMock("electron-log", () => ({
      default: {
        info: vi.fn(),
        transports: {
          file: fileTransport,
          console: consoleTransport,
        },
      },
    }));

    const { logger } = await import("./logger.js");

    expect(logger).toBeDefined();
    expect(fileTransport.level).toBe("info");
    expect(consoleTransport.level).toBe("info");
  });
});
