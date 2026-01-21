import { Injectable, Inject } from "@devisfuture/electron-modular";
import { messages } from "../../../config.js";
import { CheckForUpdateService } from "./check-for-update.js";
import { SendUpdateInfoService } from "../send-update-info.js";
import { setStore } from "../../../$shared/store.js";
import { UPDATER_NOTIFICATION_PROVIDER } from "../../tokens.js";
import type { TUpdaterNotificationProvider } from "../../types.js";

@Injectable()
export class ControlUpdateService {
  constructor(
    private checkForUpdateService: CheckForUpdateService,
    private sendUpdateInfoService: SendUpdateInfoService,
    @Inject(UPDATER_NOTIFICATION_PROVIDER)
    private notificationProvider: TUpdaterNotificationProvider,
  ) {}

  controlUpdate() {
    this.checkForUpdateService.checkForUpdate({
      eventCallBack: ({ status, version, downloadedPercent, updateFile }) => {
        switch (status) {
          case "checking-for-update": {
            setStore("updateProcess", true);
            this.sendUpdateInfoService.sendUpdateInfo({
              message: messages.autoUpdater.checkingForUpdate,
              status,
              platform: process.platform,
            });
            break;
          }

          case "update-not-available": {
            setStore("updateProcess", false);
            this.sendUpdateInfoService.sendUpdateInfo({
              message: messages.autoUpdater.updateNotAvailable,
              status,
              platform: process.platform,
            });
            break;
          }

          case "update-available": {
            this.sendUpdateInfoService.sendUpdateInfo({
              message: messages.autoUpdater.updateAvailable,
              status,
              version,
              platform: process.platform,
            });
            break;
          }

          case "download-progress": {
            this.sendUpdateInfoService.sendUpdateInfo({
              downloadedPercent,
              status,
              platform: process.platform,
            });
            break;
          }

          case "update-downloaded": {
            setStore("updateProcess", false);
            this.sendUpdateInfoService.sendUpdateInfo({
              message: messages.autoUpdater.updateDownloaded,
              status,
              version,
              platform: process.platform,
              updateFile,
            });

            this.notificationProvider
              .setNotification({
                title: messages.autoUpdater.notificationTitle,
                body: messages.autoUpdater.notificationBody,
              })
              ?.show();
            break;
          }

          case "error": {
            setStore("updateProcess", false);
            break;
          }
          default:
            return;
        }
      },
    });
  }
}
