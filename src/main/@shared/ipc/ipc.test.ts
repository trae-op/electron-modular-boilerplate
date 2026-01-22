import type { IpcMainEvent, IpcMainInvokeEvent, WebFrameMain } from "electron";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ipcMainHandle, ipcMainOn, validateEventFrame } from "./ipc.js";

vi.mock("electron", () => ({
  ipcMain: {
    handle: vi.fn(),
    on: vi.fn(),
  },
}));

const createMockWebFrame = (url: string): Partial<WebFrameMain> => ({
  url,
});

const createMockInvokeEvent = (
  frameUrl: string | null,
): Partial<IpcMainInvokeEvent> => ({
  senderFrame: frameUrl ? (createMockWebFrame(frameUrl) as WebFrameMain) : null,
  frameId: 1,
  processId: 1,
  sender: {} as any,
});

const createMockEvent = (): Partial<IpcMainEvent> => ({
  reply: vi.fn(),
  sender: {} as any,
  frameId: 1,
  processId: 1,
});

describe("@shared/ipc", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ipcMainHandle", () => {
    it("registers handler and validates frame", async () => {
      const handler = vi.fn().mockResolvedValue({ ok: true });
      const mockEvent = createMockInvokeEvent("file:///window:main#/");

      ipcMainHandle("getVersion", handler);

      const { ipcMain } = await import("electron");
      const registeredHandler = vi.mocked(ipcMain.handle).mock.calls[0][1];

      const result = await registeredHandler(
        mockEvent as IpcMainInvokeEvent,
        "payload",
      );

      expect(handler).toHaveBeenCalledWith("payload");
      expect(result).toEqual({ ok: true });
    });

    it("throws when frame is null", async () => {
      const handler = vi.fn();
      const mockEvent = createMockInvokeEvent(null);

      ipcMainHandle("getVersion", handler);

      const { ipcMain } = await import("electron");
      const registeredHandler = vi.mocked(ipcMain.handle).mock.calls[0][1];

      await expect(
        registeredHandler(mockEvent as IpcMainInvokeEvent, undefined),
      ).rejects.toThrow("Invalid frame: Frame is null");
    });

    it("throws on unauthorized frame", async () => {
      const handler = vi.fn();
      const mockEvent = createMockInvokeEvent("https://evil.com/");

      ipcMainHandle("getVersion", handler);

      const { ipcMain } = await import("electron");
      const registeredHandler = vi.mocked(ipcMain.handle).mock.calls[0][1];

      await expect(
        registeredHandler(mockEvent as IpcMainInvokeEvent, undefined),
      ).rejects.toThrow("The event is from an unauthorized frame");
    });
  });

  describe("ipcMainOn", () => {
    it("registers channel and calls callback", async () => {
      const callback = vi.fn();

      ipcMainOn("logout", callback);

      const { ipcMain } = await import("electron");
      const registeredHandler = vi.mocked(ipcMain.on).mock.calls[0][1];
      const mockEvent = createMockEvent();

      registeredHandler(mockEvent as IpcMainEvent, { id: "123" });

      expect(callback).toHaveBeenCalledWith(mockEvent, { id: "123" });
    });
  });

  describe("validateEventFrame", () => {
    it("allows file protocol frames with hash", () => {
      const frame = createMockWebFrame("file:///window:main#/");

      expect(() => validateEventFrame(frame as WebFrameMain)).not.toThrow();
    });

    it("allows localhost in development", () => {
      const originalEnv = process.env.NODE_ENV;
      const originalPort = process.env.LOCALHOST_ELECTRON_SERVER_PORT;

      process.env.NODE_ENV = "development";
      process.env.LOCALHOST_ELECTRON_SERVER_PORT = "8844";
      const frame = createMockWebFrame("http://localhost:8844/");

      expect(() => validateEventFrame(frame as WebFrameMain)).not.toThrow();

      process.env.NODE_ENV = originalEnv;
      process.env.LOCALHOST_ELECTRON_SERVER_PORT = originalPort;
    });

    it("rejects unauthorized frames", () => {
      const frame = createMockWebFrame("https://evil.com/");

      expect(() => validateEventFrame(frame as WebFrameMain)).toThrow(
        "The event is from an unauthorized frame",
      );
    });

    it("throws when frame is null", () => {
      expect(() => validateEventFrame(null as any)).toThrow(
        "Invalid frame: Frame is null",
      );
    });
  });
});
