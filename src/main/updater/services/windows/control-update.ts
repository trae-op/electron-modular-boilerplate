import { dialog } from "electron";
import pkg from "electron-updater";
import { Injectable, Inject } from "@devisfuture/electron-modular";
import { messages } from "#main/config.js";
import { SendUpdateInfoService } from "../send-update-info.js";
import { setStore } from "@shared/store.js";
import { isDev, isPlatform } from "@shared/utils.js";
import { UPDATER_NOTIFICATION_PROVIDER } from "../../tokens.js";
import type { TUpdaterNotificationProvider } from "../../types.js";

const { autoUpdater } = pkg;

@Injectable()
export class ControlUpdateWindowsPlatformService {
  constructor(
    private sendUpdateInfoService: SendUpdateInfoService,
    @Inject(UPDATER_NOTIFICATION_PROVIDER)
    private notificationProvider: TUpdaterNotificationProvider,
  ) {}

  controlUpdate() {
    if (isPlatform("win32") && !isDev()) {
      autoUpdater.on("checking-for-update", () => {
        setStore("updateProcess", true);
        this.sendUpdateInfoService.sendUpdateInfo({
          message: messages.autoUpdater.checkingForUpdate,
          status: "checking-for-update",
          platform: process.platform,
        });
      });

      autoUpdater.on("update-not-available", () => {
        setStore("updateProcess", false);
        this.sendUpdateInfoService.sendUpdateInfo({
          message: messages.autoUpdater.updateNotAvailable,
          status: "update-not-available",
          platform: process.platform,
        });
      });

      autoUpdater.on("update-available", (info) => {
        this.sendUpdateInfoService.sendUpdateInfo({
          message: messages.autoUpdater.updateAvailable,
          status: "update-available",
          version: info.version,
          platform: process.platform,
        });
      });

      autoUpdater.on("download-progress", (progress) => {
        this.sendUpdateInfoService.sendUpdateInfo({
          downloadedPercent: progress.percent.toFixed(2),
          status: "download-progress",
          platform: process.platform,
        });
      });

      autoUpdater.on("update-downloaded", (info: pkg.UpdateDownloadedEvent) => {
        setStore("updateProcess", false);
        this.sendUpdateInfoService.sendUpdateInfo({
          message: messages.autoUpdater.updateDownloaded,
          status: "update-downloaded",
          version: info.version,
          platform: process.platform,
        });

        this.notificationProvider
          .setNotification({
            title: messages.autoUpdater.notificationTitle,
            body: messages.autoUpdater.notificationBody,
          })
          ?.show();
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
}
