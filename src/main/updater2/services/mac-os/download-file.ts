import { app } from "electron";
import path from "node:path";
import fs from "node:fs";
import { Injectable } from "@devisfuture/electron-modular";
import type { TOptionsDownloadFile } from "./types.js";
import { folders, restApi } from "../../../config.js";
import { CreateLatestVersionFolderService } from "./create-latest-version-folder.js";

@Injectable()
export class DownloadFileService {
  constructor(
    private createLatestVersionFolderService: CreateLatestVersionFolderService,
  ) {}

  async downloadFile({
    name,
    assetId,
    size,
    onDownloadProgress,
  }: TOptionsDownloadFile): Promise<TUpdateData["status"]> {
    return new Promise(async (resolve, reject) => {
      const downloadsPath = app.getPath("downloads");
      const folderPath = path.join(downloadsPath, folders.download);
      const folderCreated =
        await this.createLatestVersionFolderService.createFolder(folderPath);
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
            ...(token !== undefined
              ? { Authorization: `Bearer ${token}` }
              : {}),
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
}
