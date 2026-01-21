import { compareVersions } from "compare-versions";
import { app, dialog } from "electron";
import path from "node:path";

import { folders, messages, restApi } from "#main/config.js";

import { downloadFile } from "./download.js";
import type { TOptionsUpdater } from "./types.js";
import { isVerify } from "./verifyDownload.js";

export async function checkForUpdate({ eventCallBack }: TOptionsUpdater) {
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

    if (!response.ok) {
      eventCallBack({
        status: "update-not-available",
      });

      dialog.showMessageBox({
        title: messages.autoUpdater.error,
        message: `${messages.autoUpdater.fetchError} ${response.status} ${response.statusText}`,
      });

      return null;
    }

    const data = await response.json();

    if (data.tag_name) {
      const latestVersion = data.tag_name.replace(/^v/, "");
      const currentVersion = app.getVersion();

      if (compareVersions(latestVersion, currentVersion) === 1) {
        const updateFile = data.assets.find((asset: { name: string }) =>
          asset.name.endsWith(".dmg"),
        );

        if (updateFile !== null && updateFile.browser_download_url) {
          const verify = await isVerify(folderPath, updateFile.name);
          if (verify) {
            eventCallBack({
              version: latestVersion,
              status: "update-downloaded",
              updateFile: updateFile.name,
            });

            return null;
          }

          eventCallBack({
            version: latestVersion,
            status: "update-available",
          });
          downloadFile({
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
    } else {
      eventCallBack({
        status: "update-not-available",
      });

      return null;
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
