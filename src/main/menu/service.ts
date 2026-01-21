import { Menu } from "electron";
import { menu } from "../config.js";
import { Injectable } from "@devisfuture/electron-modular";
import { isPlatform } from "#shared/utils.js";
import type { TMenuItem } from "#main/types.js";

const defaultMenu = new Map<string, TMenuItem[]>([
  [
    "default", 
    [
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
    ]
  ],
]);

@Injectable()
export class MenuService {
  constructor() {}

  getMenu(): TMenuItem[] {
    return defaultMenu.get("default")!;
  }

  collectMenu(items?: TMenuItem[]): void {
    this.build(items !== undefined ? items : this.getMenu());
  }

  private build(items?: TMenuItem[]): void {
    Menu.setApplicationMenu(
      Menu.buildFromTemplate(items !== undefined ? items : this.getMenu()),
    );
  }
}
