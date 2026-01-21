import { createWindow } from "#main/@shared/control-window/create.js";
import { setStore } from "#main/@shared/store.js";

import { checkForUpdates } from "#main/updater/services/checkForUpdates.js";

let isCheckFirst = true;
let isEvents = true;

export function openWindow(): void {
  const window = createWindow<TWindows["updateApp"]>({
    hash: "window:update-app",
    isCache: true,
    options: {
      width: 340,
      height: 340,
      alwaysOnTop: true,
      autoHideMenuBar: true,
      minimizable: false,
      maximizable: false,
      title: "",
    },
  });

  if (isEvents) {
    isEvents = false;
    window.webContents.on("did-finish-load", () => {
      setStore("updateWindow", window);

      if (isCheckFirst) {
        checkForUpdates();
        isCheckFirst = false;
      }
    });

    window.on("show", () => {
      setStore("updateWindow", window);

      if (!isCheckFirst) {
        checkForUpdates();
      }
    });
  }
}
