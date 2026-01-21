import pkg from "electron-updater";

import { isDev, isPlatform } from "#main/@shared/utils.js";

import { isUpdateProcess } from "#main/updater/services/checkUpdateProcess.js";
import { controlUpdate } from "#main/updater/services/mac/controlUpdate.js";

const { autoUpdater } = pkg;

export function checkForUpdates() {
  if (isUpdateProcess() || isDev()) {
    return;
  }

  if (isPlatform("win32")) {
    autoUpdater.checkForUpdates();
  } else {
    controlUpdate();
  }
}
