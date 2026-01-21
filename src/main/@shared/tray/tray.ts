import { Menu, Tray, app } from "electron";
import path from "node:path";

import { icons, menu } from "#main/config.js";

import { getAssetsPath } from "#main/@shared/path-resolver.js";
import type { TItem } from "#main/@shared/tray/types.js";
import { isPlatform } from "#main/@shared/utils.js";

let tray: Tray | undefined = undefined;

const defaultMenu: TItem[] = [
  {
    label: menu.labels.showApp,
    name: "show",
  },
  {
    label: menu.labels.checkUpdate,
    name: "check-update",
  },
  {
    label: menu.labels.quit,
    name: "quit",
    click: () => app.quit(),
  },
];

export function getTrayMenu(): TItem[] {
  return defaultMenu;
}

export function buildTray(items?: TItem[]): void {
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

export function destroyTray(): void {
  if (tray !== undefined) {
    tray.destroy();
    tray = undefined;
  }
}
