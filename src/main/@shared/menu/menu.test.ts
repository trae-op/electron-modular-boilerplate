import type { BrowserWindow } from "electron";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { TItem } from "./types.js";

type TSetupOptions = {
  isDarwin?: boolean;
};

type TSetupReturn = {
  getMenu: () => TItem[];
  buildMenu: (
    targetWindow: BrowserWindow,
    items?: TItem[] | ((window: BrowserWindow) => TItem[]),
  ) => void;
  buildFromTemplateMock: ReturnType<typeof vi.fn>;
};

const setup = async ({
  isDarwin = false,
}: TSetupOptions = {}): Promise<TSetupReturn> => {
  vi.resetModules();

  const buildFromTemplateMock = vi.fn();

  vi.doMock("electron", () => ({
    Menu: {
      buildFromTemplate: buildFromTemplateMock,
    },
    BrowserWindow: vi.fn(),
  }));

  vi.doMock("../utils.js", () => ({
    isPlatform: vi.fn((platform: NodeJS.Platform) => {
      if (platform === "darwin") {
        return isDarwin;
      }

      return false;
    }),
  }));

  vi.doMock("../../config.js", () => ({
    menu: {
      labels: {
        app: "AppLabel",
        devTools: "DevToolsLabel",
        quit: "QuitLabel",
      },
    },
  }));

  const module = await import("./menu.js");

  return {
    getMenu: module.getMenu,
    buildMenu: module.buildMenu,
    buildFromTemplateMock,
  };
};

afterEach(() => {
  vi.resetAllMocks();
  vi.resetModules();
});

describe("getMenu", () => {
  it("returns default menu with labels when not on macOS", async () => {
    const { getMenu } = await setup();

    const result = getMenu();

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      label: "AppLabel",
      name: "app",
      submenu: [{ label: "DevToolsLabel" }, { label: "QuitLabel" }],
    });

    expect(result[1]).toMatchObject({
      label: "Edit",
      name: "edit",
    });
  });

  it("omits the app label when running on macOS", async () => {
    const { getMenu } = await setup({ isDarwin: true });

    const result = getMenu();

    expect(result[0].label).toBeUndefined();
    expect(result[0].name).toBe("app");
  });
});

describe("buildMenu", () => {
  it("uses the default menu template when no items are provided", async () => {
    const { buildMenu, getMenu, buildFromTemplateMock } = await setup();
    const targetWindow = {
      setMenu: vi.fn(),
    } as unknown as BrowserWindow;
    const builtMenu = { id: "default" };
    buildFromTemplateMock.mockReturnValue(builtMenu);

    const expectedTemplate = getMenu();

    buildMenu(targetWindow);

    expect(buildFromTemplateMock).toHaveBeenCalledWith(expectedTemplate);
    expect(targetWindow.setMenu).toHaveBeenCalledWith(builtMenu);
  });

  it("uses a provided array of items", async () => {
    const { buildMenu, buildFromTemplateMock } = await setup();
    const targetWindow = {
      setMenu: vi.fn(),
    } as unknown as BrowserWindow;
    const customItems = [
      {
        label: "Custom",
        name: "app",
        submenu: [],
      },
    ] as TItem[];
    const builtMenu = { id: "custom" };
    buildFromTemplateMock.mockReturnValue(builtMenu);

    buildMenu(targetWindow, customItems);

    expect(buildFromTemplateMock).toHaveBeenCalledWith(customItems);
    expect(targetWindow.setMenu).toHaveBeenCalledWith(builtMenu);
  });

  it("evaluates a function to retrieve menu items", async () => {
    const { buildMenu, buildFromTemplateMock } = await setup();
    const targetWindow = {
      setMenu: vi.fn(),
    } as unknown as BrowserWindow;
    const customItems = [
      {
        label: "Fn",
        name: "edit",
        submenu: [],
      },
    ] as TItem[];
    const builtMenu = { id: "fn" };
    buildFromTemplateMock.mockReturnValue(builtMenu);
    const factory = vi.fn(() => customItems);

    buildMenu(targetWindow, factory);

    expect(factory).toHaveBeenCalledWith(targetWindow);
    expect(buildFromTemplateMock).toHaveBeenCalledWith(customItems);
    expect(targetWindow.setMenu).toHaveBeenCalledWith(builtMenu);
  });
});
