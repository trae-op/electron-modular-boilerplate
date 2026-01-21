import pkg from "electron-updater";

import { publishOptions } from "#main/config.js";

import { isDev, isPlatform } from "#main/@shared/utils.js";

const { autoUpdater } = pkg;

export function setFeedURL() {
  if (isPlatform("win32") && !isDev()) {
    const token = process.env.GH_TOKEN;
    autoUpdater.disableDifferentialDownload = true;
    autoUpdater.setFeedURL({
      provider: "github",
      repo: publishOptions.repo,
      owner: publishOptions.owner,
      ...(token !== undefined
        ? {
            token: process.env.GH_TOKEN,
          }
        : {}),
    });
  }
}
