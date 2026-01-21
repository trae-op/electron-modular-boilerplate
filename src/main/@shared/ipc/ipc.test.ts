import type { IpcMainEvent, IpcMainInvokeEvent, WebContents } from "electron";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  TInvokeEnvelope,
  TReceiveEnvelope,
  TSendEnvelope,
} from "./types.js";

const ipcMainOnMock = vi.fn();
const ipcMainHandleMock = vi.fn();

vi.mock("electron", () => ({
  ipcMain: {
    on: ipcMainOnMock,
    handle: ipcMainHandleMock,
  },
}));

const validateEventFrameMock = vi.fn();

vi.mock("../utils.js", () => ({
  validateEventFrame: validateEventFrameMock,
}));

const ipcModule = await import("./ipc.js");
const { registerIpc, sendToRenderer, replyToRenderer } = ipcModule;
const { validateEventFrame } = await import("../utils.js");
const { ipcMain } = await import("electron");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("registerIpc", () => {
  it("registers send handler when onSend is provided", () => {
    const onSend = vi.fn();

    registerIpc({ onSend });

    expect(ipcMain.on).toHaveBeenCalledTimes(1);
    expect(ipcMain.on).toHaveBeenCalledWith("send", expect.any(Function));

    const handler = ipcMainOnMock.mock.calls[0][1];
    const mockEvent = {
      senderFrame: { id: "frame" },
    } as unknown as IpcMainEvent;
    const payload: TSendEnvelope<"logout"> = { type: "logout" };

    handler(mockEvent, payload);

    expect(validateEventFrame).toHaveBeenCalledWith(mockEvent.senderFrame);
    expect(onSend).toHaveBeenCalledWith({ event: mockEvent, payload });
  });

  it("does not register send handler when onSend is absent", () => {
    registerIpc({});

    expect(ipcMain.on).not.toHaveBeenCalled();
  });

  it("registers invoke handler when onInvoke is provided", async () => {
    const onInvoke = vi.fn().mockResolvedValue("result");

    registerIpc({ onInvoke });

    expect(ipcMain.handle).toHaveBeenCalledTimes(1);
    expect(ipcMain.handle).toHaveBeenCalledWith("invoke", expect.any(Function));

    const handler = ipcMainHandleMock.mock.calls[0][1];
    const mockEvent = {
      senderFrame: { id: "invoke-frame" },
    } as unknown as IpcMainInvokeEvent;
    const payload: TInvokeEnvelope<"getVersion"> = {
      type: "getVersion",
      data: "1.0.0",
    };

    const result = await handler(mockEvent, payload);

    expect(validateEventFrame).toHaveBeenCalledWith(mockEvent.senderFrame);
    expect(onInvoke).toHaveBeenCalledWith({ event: mockEvent, payload });
    expect(result).toBe("result");
  });

  it("does not register invoke handler when onInvoke is absent", () => {
    registerIpc({});

    expect(ipcMain.handle).not.toHaveBeenCalled();
  });
});

describe("sendToRenderer", () => {
  it("forwards payload to renderer process", () => {
    const webContents = { send: vi.fn() } as unknown as WebContents;
    const payload: TReceiveEnvelope<"auth"> = {
      type: "auth",
      data: { isAuthenticated: true },
    };

    sendToRenderer(webContents, payload);

    expect(webContents.send).toHaveBeenCalledWith("receive", payload);
  });
});

describe("replyToRenderer", () => {
  it("replies to renderer process with payload", () => {
    const event = { reply: vi.fn() } as unknown as IpcMainEvent;
    const payload: TReceiveEnvelope<"auth"> = {
      type: "auth",
      data: { isAuthenticated: false },
    };

    replyToRenderer(event, payload);

    expect(event.reply).toHaveBeenCalledWith("receive", payload);
  });
});
