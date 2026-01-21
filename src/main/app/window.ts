import { app, BrowserWindow, Event } from "electron";
import {
  Inject,
  WindowManager,
  destroyWindows,
} from "@devisfuture/electron-modular";
import { getElectronStorage } from "@shared/store.js";
import { isDev } from "@shared/utils.js";
import { ipcMainOn, ipcWebContentsSend } from "#main/@shared/ipc/ipc.js";
import { menu } from "../config.js";
import type { TWindowManager } from "../types.js";
import {
  AUTH_PROVIDER,
  MENU_PROVIDER,
  TRAY_PROVIDER,
  UPDATER_PROVIDER,
} from "./tokens.js";
import type {
  TAuthProvider,
  TMenuProvider,
  TTrayProvider,
  TUpdaterProvider,
} from "./types.js";

@WindowManager<TWindows["main"]>({
  hash: "window:main",
  isCache: true,
  options: {
    resizable: isDev(),
    show: false,
    width: 350,
    height: 500,
  },
})
export class AppWindow implements TWindowManager {
  private isWillClose = false;

  constructor(
    @Inject(MENU_PROVIDER) private readonly menuProvider: TMenuProvider,
    @Inject(TRAY_PROVIDER) private readonly trayProvider: TTrayProvider,
    @Inject(AUTH_PROVIDER) private readonly authProvider: TAuthProvider,
    @Inject(UPDATER_PROVIDER)
    private readonly updaterProvider: TUpdaterProvider,
  ) {
    this.updaterProvider.setFeedUrl();
    this.updaterProvider.controlUpdateWindowsPlatform();

    app.on("before-quit", () => {
      this.isWillClose = true;

      this.trayProvider.destroyTray();
      destroyWindows();
    });
  }

  onWebContentsDidFinishLoad(window: BrowserWindow): void {
    this.buildMenu(window);
    this.buildTray(window);
    this.checkAuthenticated(window);
    this.ipcCheckSync(window);
    this.authProvider.setCheckAccessInterval(window);

    const userId = getElectronStorage("userId");
    const authToken = getElectronStorage("authToken");

    if (userId && authToken) {
      this.updaterProvider.checkForUpdates();
    }
  }

  private ipcCheckSync(window: BrowserWindow): void {
    ipcMainOn('checkAuth', (event) => {
      const result = this.authProvider.checkAuthenticated(window);

      event.reply("checkAuth", {
        isAuthenticated: result !== undefined && result.isAuthenticated,
      });
    });
  }

  private async checkAuthenticated(window: BrowserWindow) {
    const result = this.authProvider.checkAuthenticated(window);
    ipcWebContentsSend('auth', window.webContents, {
      isAuthenticated:
        result !== undefined && result.isAuthenticated !== undefined,
    });
  }

  private buildTray(window: BrowserWindow): void {
    this.trayProvider.buildTray(
      this.trayProvider.getTray().map((item) => {
        if (item.name === "show") {
          item.click = () => {
            window.show();
            if (app.dock) {
              app.dock.show();
            }
          };
        }

        if (item.name === "quit") {
          item.click = () => app.quit();
        }

        return item;
      }),
    );
  }

  private buildMenu(window: BrowserWindow): void {
    this.menuProvider.buildMenu(
      this.menuProvider.getMenu().map((item) => {
        if (item.name === "app") {
          item.submenu = [
            {
              label: menu.labels.devTools,
              click: () => window.webContents.openDevTools(),
            },
            {
              label: menu.labels.quit,
              click: () => app.quit(),
            },
          ];
        }

        if (item.name === "edit") {
          item.submenu = [
            { role: "undo" },
            { role: "redo" },
            { type: "separator" },
            { role: "cut" },
            { role: "copy" },
            { role: "paste" },
            { role: "pasteAndMatchStyle" },
            { role: "delete" },
            { role: "selectAll" },
          ];
        }

        return item;
      }),
    );
  }

  onShow(): void {
    this.isWillClose = false;
  }

  onClose(event: Event, window: BrowserWindow): void {
    if (this.isWillClose) {
      return;
    }

    event.preventDefault();
    window.hide();
    if (app.dock) {
      app.dock.hide();
    }
  }
}
