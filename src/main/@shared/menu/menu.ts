import { BrowserWindow, Menu } from "electron";

import { menu } from "../../config.js";

import { isPlatform } from "../utils.js";
import { TItem } from "./types.js";

const defaultMenu: TItem[] = [
  {
    label: isPlatform("darwin") ? undefined : menu.labels.app,
    name: "app",
    submenu: [
      {
        label: menu.labels.devTools,
      },
      {
        label: menu.labels.quit,
      },
    ],
  },
  {
    label: "Edit",
    name: "edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "pasteAndMatchStyle" },
      { role: "delete" },
      { role: "selectAll" },
    ],
  },
];

export function getMenu(): TItem[] {
  return defaultMenu;
}

export function buildMenu(
  targetWindow: BrowserWindow,
  items?: TItem[] | ((window: BrowserWindow) => TItem[]),
): void {
  const template =
    typeof items === "function"
      ? items(targetWindow)
      : items !== undefined
        ? items
        : defaultMenu;

  targetWindow.setMenu(Menu.buildFromTemplate(template));
}
