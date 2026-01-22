import {
  Inject,
  WindowManager,
  destroyWindows,
} from "@devisfuture/electron-modular";
import { BrowserWindow, Event, app } from "electron";

import { isDev } from "#shared/utils.js";

import { menu } from "#main/config.js";

import type { TWindowManager } from "../types.js";
import { MENU_PROVIDER, TRAY_PROVIDER } from "./tokens.js";
import type { TMenuProvider, TTrayProvider } from "./types.js";

@WindowManager<TWindows["main"]>({
  hash: "window:main",
  isCache: true,
  options: {
    resizable: isDev(),
    show: false,
    width: 500,
    height: 500,
  },
})
export class AppWindow implements TWindowManager {
  private isWillClose = false;

  constructor(
    @Inject(MENU_PROVIDER) private readonly menuProvider: TMenuProvider,
    @Inject(TRAY_PROVIDER) private readonly trayProvider: TTrayProvider,
  ) {
    app.on("before-quit", () => {
      this.isWillClose = true;

      this.trayProvider.destroy();
      destroyWindows();
    });
  }

  onWebContentsDidFinishLoad(window: BrowserWindow): void {
    this.menuProvider.collect(
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
        return item;
      }),
    );

    this.trayProvider.collect(
      this.trayProvider.getMenu().map((item) => {
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
