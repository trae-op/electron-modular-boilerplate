import { isDev, isPlatform } from "#shared/utils.js";
import { Injectable } from "@devisfuture/electron-modular";
import pkg from "electron-updater";

import { publishOptions } from "#main/config.js";

const { autoUpdater } = pkg;

@Injectable()
export class SetFeedUrlService {
  constructor() {}

  setFeedURL() {
    if (isPlatform("win32") && !isDev()) {
      const token = process.env.GH_TOKEN;
      autoUpdater.disableDifferentialDownload = true;
      autoUpdater.setFeedURL({
        provider: "github",
        repo: publishOptions.repo,
        owner: publishOptions.owner,
        private: true,
        ...(token !== undefined
          ? {
              token: process.env.GH_TOKEN,
            }
          : {}),
      });
    }
  }
}
