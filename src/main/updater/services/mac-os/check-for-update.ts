import { Injectable } from "@devisfuture/electron-modular";
import { compareVersions } from "compare-versions";
import { app, dialog } from "electron";
import path from "node:path";

import { folders, messages, restApi } from "#main/config.js";

import { DownloadFileService } from "./download-file.js";
import { TOptionsUpdater } from "./types.js";
import { VerifyService } from "./verify.js";

@Injectable()
export class CheckForUpdateService {
  constructor(
    private downloadFileService: DownloadFileService,
    private verifyService: VerifyService,
  ) {}

  async checkForUpdate({ eventCallBack }: TOptionsUpdater): Promise<any> {
    try {
      eventCallBack({
        status: "checking-for-update",
      });

      const downloadsPath = app.getPath("downloads");
      const folderPath = path.join(downloadsPath, folders.download);
      const token = process.env.GH_TOKEN;
      const response = await fetch(`${restApi.urls.githubReleases}/latest`, {
        method: "GET",
        headers: {
          ...(token !== undefined ? { Authorization: `Bearer ${token}` } : {}),
          Accept: "application/json",
        },
      });
      const data = await response.json();

      if (data.tag_name) {
        const latestVersion = data.tag_name.replace(/^v/, "");
        const currentVersion = app.getVersion();

        if (compareVersions(latestVersion, currentVersion) === 1) {
          const updateFile = data.assets.find((asset: { name: string }) =>
            asset.name.endsWith(".dmg"),
          );

          if (updateFile !== null && updateFile.browser_download_url) {
            const verify = await this.verifyService.isVerify(
              folderPath,
              updateFile.name,
            );

            if (verify) {
              eventCallBack({
                version: latestVersion,
                status: "update-downloaded",
                updateFile: updateFile.name,
              });

              return undefined;
            }

            eventCallBack({
              version: latestVersion,
              status: "update-available",
            });
            this.downloadFileService
              .downloadFile({
                name: updateFile.name,
                assetId: updateFile.id,
                size: updateFile.size,
                onDownloadProgress: (percent) => {
                  eventCallBack({
                    status: "download-progress",
                    downloadedPercent: String(percent),
                  });
                },
              })
              .then((status) => {
                eventCallBack({
                  status,
                  version: latestVersion,
                  updateFile: updateFile.name,
                });
              })
              .catch((error) => {
                if (error instanceof Error) {
                  eventCallBack({
                    status: "error",
                  });
                  dialog.showMessageBox({
                    title: messages.autoUpdater.error,
                    message: error.message,
                  });
                }
              });
          }
        } else {
          eventCallBack({
            status: "update-not-available",
          });

          return null;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        eventCallBack({
          status: "error",
        });

        dialog.showMessageBox({
          title: messages.autoUpdater.error,
          message: error.message,
        });
      }
    }
  }
}
