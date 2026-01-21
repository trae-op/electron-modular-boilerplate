import { app, Menu, Tray, type BrowserWindow } from "electron";
import path from "node:path";
import { icons, menu } from "../config.js";
import { Injectable } from "@devisfuture/electron-modular";
import { isDev, isPlatform } from "@shared/utils.js";
import { getAssetsPath } from "@shared/path-resolver.js";
import type { TMenuItem } from "#main/types.js";

const defaultMenu: TMenuItem[] = [
  {
    label: menu.labels.showApp,
    name: "show",
  },
  {
    label: menu.labels.checkUpdate,
    name: "check-update",
    visible: !isDev(),
  },
  {
    label: menu.labels.quit,
    name: "quit",
  },
];

let tray: Tray | undefined = undefined;

@Injectable()
export class TrayService {
  constructor() {}

  collect(window: BrowserWindow, items?: TMenuItem[]): void {
    const menuItems = items !== undefined ? items : defaultMenu;
    this.build(menuItems.map((item) => {
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
    }));
  }

  private build(items?: TMenuItem[]): void {
    if (tray === undefined) {
      tray = new Tray(
        path.join(
          getAssetsPath(),
          isPlatform("darwin") ? icons.trayIconTemplate : icons.trayIcon,
        ),
      );
    }

    tray.setContextMenu(
      Menu.buildFromTemplate(items !== undefined ? items : defaultMenu),
    );
  }

  destroy(): void {
    if (tray !== undefined) {
      tray.destroy();
      tray = undefined;
    }
  }
}
