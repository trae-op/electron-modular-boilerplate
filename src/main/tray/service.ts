import { getAssetsPath } from "#shared/path-resolver.js";
import { isDev, isPlatform } from "#shared/utils.js";
import { Injectable } from "@devisfuture/electron-modular";
import { Menu, Tray } from "electron";
import path from "node:path";

import { icons, menu } from "../config.js";

import type { TMenuItem } from "#main/types.js";

const defaultMenu = new Map<string, TMenuItem[]>([
  [
    "default",
    [
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
    ],
  ],
]);

let tray: Tray | undefined = undefined;

@Injectable()
export class TrayService {
  constructor() {}

  getMenu(): TMenuItem[] {
    return defaultMenu.get("default")!;
  }

  collect(items?: TMenuItem[]): void {
    this.build(items !== undefined ? items : this.getMenu());
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
      Menu.buildFromTemplate(items !== undefined ? items : this.getMenu()),
    );
  }

  destroy(): void {
    if (tray !== undefined) {
      tray.destroy();
      tray = undefined;
    }
  }
}
