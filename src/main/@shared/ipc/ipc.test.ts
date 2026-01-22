import { beforeEach, describe, expect, it, vi } from "vitest";

import { ipcMainHandle, ipcMainOn, validateEventFrame } from "./ipc.js";

vi.mock("electron", () => ({
  ipcMain: {
    handle: vi.fn(),
    on: vi.fn(),
  },
}));

describe("@shared/ipc", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ipcMainHandle", () => {
    it("registers handler and validates frame", async () => {
      const handler = vi.fn().mockResolvedValue({ ok: true });
      const mockFrame = { url: "file:///window:main#/" };
      const event = { senderFrame: mockFrame };

      ipcMainHandle("getAppVersion", handler);

      const { ipcMain } = await import("electron");
      const registeredHandler = vi.mocked(ipcMain.handle).mock.calls[0][1];

      const result = await registeredHandler(event, "payload");

      expect(handler).toHaveBeenCalledWith("payload");
      expect(result).toEqual({ ok: true });
    });

    it("throws when frame is null", async () => {
      const handler = vi.fn();
      const event = { senderFrame: null };

      ipcMainHandle("getAppVersion", handler);

      const { ipcMain } = await import("electron");
      const registeredHandler = vi.mocked(ipcMain.handle).mock.calls[0][1];

      await expect(registeredHandler(event, undefined)).rejects.toThrow(
        "Invalid frame: Frame is null",
      );
    });
  });

  describe("ipcMainOn", () => {
    it("registers channel and calls callback", async () => {
      const callback = vi.fn();

      ipcMainOn("logout", callback);

      const { ipcMain } = await import("electron");
      const registeredHandler = vi.mocked(ipcMain.on).mock.calls[0][1];
      const event = { reply: vi.fn() } as any;

      registeredHandler(event, { id: "123" });

      expect(callback).toHaveBeenCalledWith(event, { id: "123" });
    });
  });

  describe("validateEventFrame", () => {
    it("allows file protocol frames with hash", () => {
      const frame = { url: "file:///window:main#/" } as any;

      expect(() => validateEventFrame(frame)).not.toThrow();
    });

    it("allows localhost in development", () => {
      process.env.NODE_ENV = "development";
      process.env.LOCALHOST_ELECTRON_SERVER_PORT = "8844";
      const frame = { url: "http://localhost:8844/" } as any;

      expect(() => validateEventFrame(frame)).not.toThrow();
    });

    it("rejects unauthorized frames", () => {
      const frame = { url: "https://evil.com/" } as any;

      expect(() => validateEventFrame(frame)).toThrow(
        "The event is from an unauthorized frame",
      );
    });
  });
});
