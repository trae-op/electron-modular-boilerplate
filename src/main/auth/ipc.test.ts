import { describe, expect, it, vi } from "vitest";

vi.mock("@devisfuture/electron-modular", () => ({
  IpcHandler: () => () => undefined,
  getWindow: vi.fn(),
}));

vi.mock("#shared/ipc/ipc.js", () => ({
  ipcMainOn: vi.fn(),
  ipcWebContentsSend: vi.fn(),
}));

vi.mock("#shared/store.js", () => ({
  getElectronStorage: vi.fn(),
}));

vi.mock("#main/cache-responses.js", () => ({
  cacheUser: vi.fn(),
}));

describe("AuthIpc", () => {
  it("registers auth IPC handlers", async () => {
    const { ipcMainOn } = await import("#shared/ipc/ipc.js");
    const { AuthIpc } = await import("./ipc.js");

    const authService = { logout: vi.fn() } as any;
    const authWindow = { create: vi.fn() } as any;
    const mainWindow = { webContents: {} } as any;

    const getWindow = vi
      .fn()
      .mockImplementation((name: string) =>
        name === "window:auth" ? authWindow : mainWindow,
      );

    const ipc = new AuthIpc(authService);
    ipc.onInit({ getWindow } as any);

    expect(ipcMainOn).toHaveBeenCalledWith("windowAuth", expect.any(Function));
    expect(ipcMainOn).toHaveBeenCalledWith("checkAuth", expect.any(Function));
    expect(ipcMainOn).toHaveBeenCalledWith("logout", expect.any(Function));
  });

  it("creates auth window with provider URL", async () => {
    const { ipcMainOn } = await import("#shared/ipc/ipc.js");
    const { AuthIpc } = await import("./ipc.js");

    const authService = { logout: vi.fn() } as any;
    const authWindow = { create: vi.fn() } as any;
    const mainWindow = { webContents: {} } as any;

    const getWindow = vi
      .fn()
      .mockImplementation((name: string) =>
        name === "window:auth" ? authWindow : mainWindow,
      );

    const ipc = new AuthIpc(authService);
    ipc.onInit({ getWindow } as any);

    const handler = vi
      .mocked(ipcMainOn)
      .mock.calls.find((call) => call[0] === "windowAuth")?.[1] as any;

    await handler(null, { provider: "google" });

    expect(authWindow.create).toHaveBeenCalledWith(
      expect.objectContaining({
        loadURL: expect.stringContaining("/auth/google"),
        options: expect.objectContaining({
          webPreferences: { partition: "persist:auth" },
        }),
      }),
    );
  });

  it("checks auth and notifies renderer", async () => {
    const { ipcMainOn, ipcWebContentsSend } =
      await import("#shared/ipc/ipc.js");
    const { getElectronStorage } = await import("#shared/store.js");
    const { cacheUser } = await import("#main/cache-responses.js");
    const { getWindow: getWindows } =
      await import("@devisfuture/electron-modular");
    const { AuthIpc } = await import("./ipc.js");

    vi.mocked(getElectronStorage).mockReturnValue("user-1");
    vi.mocked(cacheUser).mockReturnValue({ id: "user-1" } as any);

    const authService = { logout: vi.fn() } as any;
    const authWindow = { create: vi.fn() } as any;
    const mainWindow = { webContents: {} } as any;

    vi.mocked(getWindows).mockImplementation((name: string) =>
      name === "window:main" ? mainWindow : undefined,
    );

    const getWindow = vi
      .fn()
      .mockImplementation((name: string) =>
        name === "window:auth" ? authWindow : mainWindow,
      );

    const ipc = new AuthIpc(authService);
    ipc.onInit({ getWindow } as any);

    const handler = vi
      .mocked(ipcMainOn)
      .mock.calls.find((call) => call[0] === "checkAuth")?.[1] as any;

    handler();

    expect(ipcWebContentsSend).toHaveBeenCalledWith(
      "auth",
      mainWindow.webContents,
      { isAuthenticated: true },
    );
  });
});
