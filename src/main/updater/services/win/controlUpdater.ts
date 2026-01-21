import { dialog } from "electron";
import pkg from "electron-updater";

import { messages } from "#main/config.js";

import { notification } from "#main/@shared/notification.js";
import { setStore } from "#main/@shared/store.js";
import { isDev, isPlatform } from "#main/@shared/utils.js";

import { sendUpdateInfo } from "#main/updater/services/sendUpdateInfo.js";

const { autoUpdater } = pkg;

export function controlUpdater(): void {
  if (isPlatform("win32") && !isDev()) {
    autoUpdater.on("checking-for-update", () => {
      setStore("updateProcess", true);
      sendUpdateInfo({
        message: messages.autoUpdater.checkingForUpdate,
        status: "checking-for-update",
        platform: process.platform,
      });
    });

    autoUpdater.on("update-not-available", () => {
      setStore("updateProcess", false);
      sendUpdateInfo({
        message: messages.autoUpdater.updateNotAvailable,
        status: "update-not-available",
        platform: process.platform,
      });
    });

    autoUpdater.on("update-available", (info) => {
      sendUpdateInfo({
        message: messages.autoUpdater.updateAvailable,
        status: "update-available",
        version: info.version,
        platform: process.platform,
      });
    });

    autoUpdater.on("download-progress", (progress) => {
      sendUpdateInfo({
        downloadedPercent: progress.percent.toFixed(2),
        status: "download-progress",
        platform: process.platform,
      });
    });

    autoUpdater.on("update-downloaded", (info: pkg.UpdateDownloadedEvent) => {
      setStore("updateProcess", false);
      sendUpdateInfo({
        message: messages.autoUpdater.updateDownloaded,
        status: "update-downloaded",
        version: info.version,
        platform: process.platform,
      });

      if (notification) {
        notification.title = messages.autoUpdater.notificationTitle;
        notification.body = messages.autoUpdater.notificationBody;
        notification.show();
      }
    });

    autoUpdater.on("error", (error) => {
      setStore("updateProcess", false);

      dialog.showMessageBox({
        title: messages.autoUpdater.error,
        message: error.message,
      });
    });
  }
}
