import { app, shell } from "electron";
import path from "node:path";
import { Injectable } from "@devisfuture/electron-modular";
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
    const folderPath = path.join(app.getPath("downloads"), folders.download);
    this.openFolder(folderPath + "/" + updateFile);
  }
}
