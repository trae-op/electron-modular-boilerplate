import { Injectable } from "@devisfuture/electron-modular";
import { app, shell } from "electron";

import { joinPosixPath } from "#shared/utils.js";

import { folders, messages } from "#main/config.js";

import type { TPromiseOpenFolder } from "./types.js";

@Injectable()
export class OpenLatestVersionService {
  constructor() {}

  private async openFolder(folderPath: string): Promise<TPromiseOpenFolder> {
    try {
      await shell.openPath(folderPath);

      return {
        ok: true,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          ok: false,
          message: error.message,
        };
      } else {
        return {
          ok: false,
          message: messages.autoUpdater.errorOpenFolder,
        };
      }
    }
  }

  openLatestVersion(updateFile: string): void {
    const updatePath = joinPosixPath(
      app.getPath(folders.downloadLatestVersion.macos.root),
      folders.downloadLatestVersion.macos.app,
      updateFile,
    );
    this.openFolder(updatePath);
  }
}
