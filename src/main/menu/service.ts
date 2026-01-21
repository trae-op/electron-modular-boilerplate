import { app, Menu, type BrowserWindow } from "electron";
import { menu } from "../config.js";
import { Injectable } from "@devisfuture/electron-modular";
import { isPlatform } from "@shared/utils.js";
import type { TItem } from "./types.js";

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

@Injectable()
export class MenuService {
  constructor() {}

  collectMenu(window: BrowserWindow, items?: TItem[]): void {
    const menuItems = items !== undefined ? items : defaultMenu;
    this.build(menuItems.map((item) => {
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
    }));
  }

  private build(items?: TItem[]): void {
    Menu.setApplicationMenu(
      Menu.buildFromTemplate(items !== undefined ? items : defaultMenu),
    );
  }
}
