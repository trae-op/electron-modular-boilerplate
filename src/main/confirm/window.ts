import { WindowManager } from "@devisfuture/electron-modular";
import { BrowserWindow } from "electron";

import type { TWindowManager } from "../types.js";

@WindowManager<TWindows["confirm"]>({
  hash: "window:confirm",
  isCache: true,
  options: {
    autoHideMenuBar: true,
    minimizable: false,
    maximizable: false,
    title: "",
    width: 400,
    height: 400,
  },
})
export class ConfirmWindow implements TWindowManager {
  private window: BrowserWindow | undefined;

  constructor() {}

  onWebContentsDidFinishLoad(window: BrowserWindow): void {
    this.window = window;
  }
}
