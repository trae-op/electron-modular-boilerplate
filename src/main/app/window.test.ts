import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@devisfuture/electron-modular", () => ({
  Inject: () => () => undefined,
  WindowManager: () => () => undefined,
  destroyWindows: vi.fn(),
}));

vi.mock("electron", () => ({
  app: {
    on: vi.fn((event: string, callback: () => void) => undefined),
    quit: vi.fn(),
    dock: {
      hide: vi.fn(),
      show: vi.fn(),
    },
  },
}));

describe("AppWindow", () => {
  const menuItems = [
    { name: "app", submenu: [] as any[] },
    { name: "edit", submenu: [] as any[] },
  ];

  const trayItems = [
    { name: "show", click: undefined },
    { name: "quit", click: undefined },
  ];

  const menuProvider = {
    getMenu: vi.fn(() => menuItems),
    collect: vi.fn(),
  };

  const trayProvider = {
    getMenu: vi.fn(() => trayItems),
    collect: vi.fn(),
    destroy: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("collects menu and tray items on load", async () => {
    const { AppWindow } = await import("./window.js");
    const appWindow = new AppWindow(menuProvider as any, trayProvider as any);

    const window = {
      webContents: { openDevTools: vi.fn() },
      show: vi.fn(),
      hide: vi.fn(),
    } as any;

    appWindow.onWebContentsDidFinishLoad(window);

    expect(menuProvider.collect).toHaveBeenCalled();
    expect(trayProvider.collect).toHaveBeenCalled();

    const collectedMenu = vi.mocked(menuProvider.collect).mock.calls[0][0];
    const appItem = collectedMenu.find((item: any) => item.name === "app");

    expect(appItem.submenu).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Developer tools" }),
        expect.objectContaining({ label: "Quit" }),
      ]),
    );
  });

  it("prevents close and hides window when not quitting", async () => {
    const { AppWindow } = await import("./window.js");
    const appWindow = new AppWindow(menuProvider as any, trayProvider as any);

    const event = { preventDefault: vi.fn() } as any;
    const window = { hide: vi.fn() } as any;

    appWindow.onClose(event, window);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(window.hide).toHaveBeenCalled();
  });

  it("allows close when quitting", async () => {
    const { app } = await import("electron");
    const { destroyWindows } = await import("@devisfuture/electron-modular");
    const { AppWindow } = await import("./window.js");

    const appWindow = new AppWindow(menuProvider as any, trayProvider as any);

    const mockedAppOn = vi.mocked(app.on);
    const calls = mockedAppOn.mock.calls as Array<[string, () => void]>;
    const beforeQuitCall = calls.find((call) => call[0] === "before-quit");
    const handler = beforeQuitCall?.[1];

    handler?.();

    const event = { preventDefault: vi.fn() } as any;
    const window = { hide: vi.fn() } as any;

    appWindow.onClose(event, window);

    expect(trayProvider.destroy).toHaveBeenCalled();
    expect(destroyWindows).toHaveBeenCalled();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});
