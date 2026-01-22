import { describe, expect, it, vi } from "vitest";

vi.mock("#shared/path-resolver.js", () => ({
  getAssetsPath: vi.fn(() => "/assets"),
}));

vi.mock("#shared/utils.js", () => ({
  isDev: vi.fn(() => false),
  isPlatform: vi.fn(() => true),
}));

const trayInstance = {
  setContextMenu: vi.fn(),
  destroy: vi.fn(),
};

vi.mock("electron", () => ({
  Menu: {
    buildFromTemplate: vi.fn((items) => items),
  },
  Tray: vi.fn(() => trayInstance),
}));

describe("TrayService", () => {
  it("builds and sets tray menu", async () => {
    const { TrayService } = await import("./service.js");
    const { Menu, Tray } = await import("electron");

    const service = new TrayService();
    service.collect();

    expect(Tray).toHaveBeenCalled();
    expect(Menu.buildFromTemplate).toHaveBeenCalled();
    expect(trayInstance.setContextMenu).toHaveBeenCalled();
  });

  it("destroys tray", async () => {
    const { TrayService } = await import("./service.js");

    const service = new TrayService();
    service.collect();
    service.destroy();

    expect(trayInstance.destroy).toHaveBeenCalled();
  });
});
