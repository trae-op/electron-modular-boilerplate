import { app } from "electron";
import fs from "node:fs";
import path from "node:path";

import { folders, restApi } from "#main/config.js";

import type { TOptionsDownloadFile } from "../types.js";
import { createFolder } from "./createLatestVersionFolder.js";

export function downloadFile({
  name,
  assetId,
  size,
  onDownloadProgress,
}: TOptionsDownloadFile): Promise<TUpdateData["status"]> {
  return new Promise(async (resolve, reject) => {
    const downloadsPath = app.getPath("downloads");
    const folderPath = path.join(downloadsPath, folders.download);
    const folderCreated = await createFolder(folderPath);
    if (!folderCreated.ok && folderCreated.message) {
      reject(new Error(folderCreated.message));
      return;
    }

    const filePath = path.join(folderPath, name);
    const token = process.env.GH_TOKEN;
    const res = await fetch(
      `${restApi.urls.githubReleases}/assets/${assetId}`,
      {
        method: "GET",
        headers: {
          ...(token !== undefined ? { Authorization: `Bearer ${token}` } : {}),
          Accept: "application/octet-stream",
        },
      },
    );

    if (!res.ok) {
      reject(new Error(`Failed: ${res.status} ${res.statusText}`));
      return;
    }

    let downloaded = 0;
    const fileStream = fs.createWriteStream(filePath);
    const reader = res.body?.getReader();

    if (!reader) {
      reject(new Error("No body stream found!"));
      return;
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      if (value) {
        downloaded += value.length;
        fileStream.write(value);

        const percent = ((downloaded / size) * 100).toFixed(2);
        onDownloadProgress(Number(percent));
      }
    }

    fileStream.end();
    resolve("update-downloaded");
  });
}
