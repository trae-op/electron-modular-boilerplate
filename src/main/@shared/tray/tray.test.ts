import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

import type { TItem } from "./types.js";

let trayConstructorMock: Mock;
let traySetContextMenuMock: Mock;
let trayDestroyMock: Mock;
let menuBuildFromTemplateMock: Mock;
let appQuitMock: Mock;
let getAssetsPathMock: Mock;
let isPlatformMock: Mock;

vi.mock("electron", () => {
  traySetContextMenuMock = vi.fn();
  trayDestroyMock = vi.fn();

  const trayInstance = {
    setContextMenu: traySetContextMenuMock,
    destroy: trayDestroyMock,
  };

  trayConstructorMock = vi.fn(() => trayInstance);
  menuBuildFromTemplateMock = vi.fn((template: TItem[]) => ({ template }));
  appQuitMock = vi.fn();

  return {
    Tray: trayConstructorMock,
    Menu: {
      buildFromTemplate: menuBuildFromTemplateMock,
    },
    app: {
      quit: appQuitMock,
    },
  };
});

const configMock = {
  menu: {
    labels: {
      showApp: "Show Electron App",
      checkUpdate: "Check For Updates",
      quit: "Quit App",
    },
  },
  icons: {
    trayIconTemplate: "tray-icon-template.png",
    trayIcon: "tray-icon.png",
  },
};

vi.mock("../../config.js", () => configMock);

vi.mock("../path-resolver.js", () => {
  getAssetsPathMock = vi.fn(() => "/mock/assets");
  return { getAssetsPath: getAssetsPathMock };
});

vi.mock("../utils.js", () => {
  isPlatformMock = vi.fn((platform: string) => platform === "darwin");
  return { isPlatform: isPlatformMock };
});

const ORIGINAL_ENV = { ...process.env };

describe("tray helpers", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("returns default tray menu and triggers quit on click", async () => {
    const { getTrayMenu } = await import("./tray.js");

    const menuItems = getTrayMenu();
    expect(menuItems).toHaveLength(3);
    expect(menuItems[0]).toMatchObject({
      label: configMock.menu.labels.showApp,
      name: "show",
    });
    expect(menuItems[1]).toMatchObject({
      label: configMock.menu.labels.checkUpdate,
      name: "check-update",
    });
    expect(menuItems[2]).toMatchObject({
      label: configMock.menu.labels.quit,
      name: "quit",
    });

    menuItems[2].click?.(undefined as any, undefined as any, undefined as any);
    expect(appQuitMock).toHaveBeenCalledTimes(1);
  });

  it("builds the tray with platform specific icon and caches the instance", async () => {
    const { buildTray, getTrayMenu } = await import("./tray.js");

    isPlatformMock.mockImplementation(
      (platform: string) => platform === "darwin",
    );

    buildTray();
    buildTray();

    expect(trayConstructorMock).toHaveBeenCalledTimes(1);

    const expectedIcon = path.join(
      "/mock/assets",
      configMock.icons.trayIconTemplate,
    );
    expect(trayConstructorMock).toHaveBeenCalledWith(expectedIcon);

    const defaultMenu = getTrayMenu();
    expect(menuBuildFromTemplateMock).toHaveBeenCalledWith(defaultMenu);
    expect(traySetContextMenuMock).toHaveBeenCalledTimes(2);
  });

  it("destroys the tray and allows rebuilding", async () => {
    const { buildTray, destroyTray } = await import("./tray.js");

    isPlatformMock.mockReturnValue(false);

    buildTray();
    expect(trayConstructorMock).toHaveBeenCalledTimes(1);

    destroyTray();
    expect(trayDestroyMock).toHaveBeenCalledTimes(1);

    buildTray();
    expect(trayConstructorMock).toHaveBeenCalledTimes(2);
  });
});
