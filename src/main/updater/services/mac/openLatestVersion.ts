import { app, shell } from "electron";
import path from "node:path";

import { folders, messages } from "#main/config.js";

import type { TPromiseOpenFolder } from "./types.js";

export async function openFolder(
  folderPath: string,
): Promise<TPromiseOpenFolder> {
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

export function openLatestVersion(updateFile: string) {
  const folderPath = path.join(app.getPath("downloads"), folders.download);
  openFolder(folderPath + "/" + updateFile);
}
