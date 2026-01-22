import { describe, expect, it, vi } from "vitest";

vi.mock("electron", () => ({
  Menu: {
    buildFromTemplate: vi.fn((items) => items),
    setApplicationMenu: vi.fn(),
  },
}));

describe("MenuService", () => {
  it("builds menu and sets application menu", async () => {
    const { MenuService } = await import("./service.js");
    const { Menu } = await import("electron");

    const service = new MenuService();
    service.collectMenu();

    expect(Menu.buildFromTemplate).toHaveBeenCalled();
    expect(Menu.setApplicationMenu).toHaveBeenCalled();
  });
});
