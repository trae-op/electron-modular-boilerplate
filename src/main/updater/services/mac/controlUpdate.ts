import { messages } from "#main/config.js";

import { notification } from "#main/@shared/notification.js";
import { setStore } from "#main/@shared/store.js";

import { checkForUpdate } from "#main/updater/services/mac/checkForUpdate.js";
import { sendUpdateInfo } from "#main/updater/services/sendUpdateInfo.js";

export function controlUpdate() {
  checkForUpdate({
    eventCallBack: ({ status, version, downloadedPercent, updateFile }) => {
      switch (status) {
        case "checking-for-update": {
          setStore("updateProcess", true);
          sendUpdateInfo({
            message: messages.autoUpdater.checkingForUpdate,
            status,
            platform: process.platform,
          });
          break;
        }

        case "update-not-available": {
          setStore("updateProcess", false);
          sendUpdateInfo({
            message: messages.autoUpdater.updateNotAvailable,
            status,
            platform: process.platform,
          });
          break;
        }

        case "update-available": {
          sendUpdateInfo({
            message: messages.autoUpdater.updateAvailable,
            status,
            version,
            platform: process.platform,
          });
          break;
        }

        case "download-progress": {
          sendUpdateInfo({
            downloadedPercent,
            status,
            platform: process.platform,
          });
          break;
        }

        case "update-downloaded": {
          setStore("updateProcess", false);
          sendUpdateInfo({
            message: messages.autoUpdater.updateDownloaded,
            status,
            version,
            platform: process.platform,
            updateFile,
          });

          if (notification) {
            notification.title = messages.autoUpdater.notificationTitle;
            notification.body = messages.autoUpdater.notificationBody;
            notification.show();
          }
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
