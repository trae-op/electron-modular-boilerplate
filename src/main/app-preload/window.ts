import { app } from "electron";
import path from "node:path";

import { createWindow } from "#main/@shared/control-window/create.js";
import { isDev } from "#main/@shared/utils.js";

export function openWindow(): void {
  createWindow<TWindows["preloadApp"]>({
    hash: "window:preload-app",
    isCache: true,
    options: {
      backgroundColor: "#444",
      width: 300,
      height: 300,
      frame: false,
      alwaysOnTop: true,
      resizable: false,
    },
    loadURL: `file://${path.join(
      app.getAppPath(),
      isDev()
        ? "./src/main/app-preload/spinner.html"
        : "../dist-main/spinner.html",
    )}`,
  });
}
