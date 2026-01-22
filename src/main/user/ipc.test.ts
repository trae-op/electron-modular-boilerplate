import { describe, expect, it, vi } from "vitest";

vi.mock("@devisfuture/electron-modular", () => ({
  IpcHandler: () => () => undefined,
  getWindow: vi.fn(),
}));

vi.mock("#shared/ipc/ipc.js", () => ({
  ipcMainOn: vi.fn(),
}));

vi.mock("#shared/store.js", () => ({
  getElectronStorage: vi.fn(),
}));

vi.mock("#main/cache-responses.js", () => ({
  cacheUser: vi.fn(),
}));

describe("UserIpc", () => {
  it("replies with cached and fetched user", async () => {
    const { ipcMainOn } = await import("#shared/ipc/ipc.js");
    const { getElectronStorage } = await import("#shared/store.js");
    const { cacheUser } = await import("#main/cache-responses.js");
    const { UserIpc } = await import("./ipc.js");

    vi.mocked(getElectronStorage).mockReturnValue("user-1");
    vi.mocked(cacheUser).mockReturnValue({ id: "user-1" } as any);

    const userService = {
      byId: vi.fn().mockResolvedValue({ id: "user-1", name: "Test" }),
    } as any;

    const mainWindow = { webContents: {} } as any;
    const { getWindow } = await import("@devisfuture/electron-modular");
    vi.mocked(getWindow).mockReturnValue(mainWindow);

    const ipc = new UserIpc(userService);
    ipc.onInit();

    const handler = vi.mocked(ipcMainOn).mock.calls[0][1] as any;

    const reply = vi.fn();
    const event = { reply } as any;

    await handler(event);

    expect(reply).toHaveBeenCalledWith("user", {
      user: { id: "user-1" },
    });
    expect(reply).toHaveBeenCalledWith("user", {
      user: { id: "user-1", name: "Test" },
    });
  });
});
