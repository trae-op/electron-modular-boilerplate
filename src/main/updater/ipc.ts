import { app } from "electron";
import pkg from "electron-updater";

import { destroyWindows } from "#main/@shared/control-window/destroy.js";
import { type TSendHandler } from "#main/@shared/ipc/types.js";
import { destroyTray } from "#main/@shared/tray/tray.js";

import { checkForUpdates } from "#main/updater/services/checkForUpdates.js";
import { openLatestVersion } from "#main/updater/services/mac/openLatestVersion.js";

const { autoUpdater } = pkg;

export const handleSend: TSendHandler = ({ payload }) => {
  const { type, data } = payload;

  if (type === "restart") {
    autoUpdater.quitAndInstall();
    return;
  }

  if (type === "checkForUpdates") {
    checkForUpdates();
    return;
  }

  if (type === "openLatestVersion" && data && "updateFile" in data) {
    openLatestVersion(data.updateFile);
    destroyTray();
    destroyWindows();
    app.quit();
  }
};
