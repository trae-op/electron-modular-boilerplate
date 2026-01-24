import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@devisfuture/electron-modular", () => ({
  IpcHandler: () => () => undefined,
  getWindow: vi.fn(),
}));

vi.mock("#shared/ipc/ipc.js", () => ({
  ipcMainOn: vi.fn(),
}));

vi.mock("electron", () => ({
  app: {
    on: vi.fn(),
  },
  dialog: {
    showMessageBox: vi.fn(),
  },
}));

describe("AppIpc", () => {
  const mockAppService = {
    destroyTrayAndWindows: vi.fn(),
    dockHide: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.removeAllListeners("uncaughtException");
    process.removeAllListeners("unhandledRejection");

    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("registers error handlers on construction", async () => {
    const { app } = await import("electron");
    const { AppIpc } = await import("./ipc.js");

    new AppIpc(mockAppService as any);

    expect(app.on).toHaveBeenCalledWith(
      "render-process-gone",
      expect.any(Function),
    );
  });

  it("handles uncaught exceptions", async () => {
    const { dialog } = await import("electron");
    const { AppIpc } = await import("./ipc.js");

    const spy = vi.spyOn(process, "on");

    new AppIpc(mockAppService as any);

    const handlerCall = spy.mock.calls.find(
      (call) => call[0] === "uncaughtException",
    );
    const handler = handlerCall?.[1];

    if (typeof handler !== "function") {
      throw new Error(
        "Could not find uncaughtException handler registered by AppIpc",
      );
    }

    const error = new Error("boom");
    handler(error);

    expect(mockAppService.destroyTrayAndWindows).toHaveBeenCalled();
    expect(mockAppService.dockHide).toHaveBeenCalled();
    expect(dialog.showMessageBox).toHaveBeenCalledWith(
      expect.objectContaining({ message: error.message }),
    );

    spy.mockRestore();
  });

  it("handles unhandled rejections", async () => {
    const { dialog } = await import("electron");
    const { AppIpc } = await import("./ipc.js");

    const spy = vi.spyOn(process, "on");
    new AppIpc(mockAppService as any);

    const handlerCall = spy.mock.calls.find(
      (call) => call[0] === "unhandledRejection",
    );
    const handler = handlerCall?.[1];

    if (typeof handler !== "function") {
      throw new Error(
        "Could not find unhandledRejection handler registered by AppIpc",
      );
    }

    const reason = "reason";
    handler(reason, Promise.reject(reason));

    expect(mockAppService.destroyTrayAndWindows).toHaveBeenCalled();
    expect(dialog.showMessageBox).toHaveBeenCalled();

    spy.mockRestore();
  });

  it("creates main window and registers close handler", async () => {
    const { ipcMainOn } = await import("#shared/ipc/ipc.js");
    const { AppIpc } = await import("./ipc.js");

    const create = vi.fn().mockResolvedValue({ show: vi.fn() });
    const getWindow = vi.fn().mockReturnValue({ create });

    const appIpc = new AppIpc(mockAppService as any);

    await appIpc.onInit({ getWindow } as any);

    expect(getWindow).toHaveBeenCalledWith("window:main");
    expect(create).toHaveBeenCalled();
    expect(ipcMainOn).toHaveBeenCalledWith(
      "windowClosePreload",
      expect.any(Function),
    );
  });
});
