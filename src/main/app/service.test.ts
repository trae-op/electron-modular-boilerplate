import { describe, expect, it, vi } from "vitest";

vi.mock("@devisfuture/electron-modular", () => ({
  Inject: () => () => undefined,
  Injectable: () => () => undefined,
  getWindow: vi.fn(),
}));

vi.mock("electron", () => ({
  app: {
    dock: {
      hide: vi.fn(),
    },
  },
}));

describe("AppService", () => {
  it("destroys tray and preload window when available", async () => {
    const { getWindow } = await import("@devisfuture/electron-modular");
    const destroy = vi.fn();

    vi.mocked(getWindow).mockReturnValue({ destroy } as any);

    const { AppService } = await import("./service.js");

    const trayProvider = { destroy: vi.fn() } as any;
    const service = new AppService(trayProvider);

    service.destroyTrayAndWindows();

    expect(trayProvider.destroy).toHaveBeenCalled();
    expect(destroy).toHaveBeenCalled();
  });

  it("hides dock when available", async () => {
    const { app } = await import("electron");
    const { AppService } = await import("./service.js");

    const trayProvider = { destroy: vi.fn() } as any;
    const service = new AppService(trayProvider);

    service.dockHide();

    expect(app.dock?.hide).toHaveBeenCalled();
  });
});
