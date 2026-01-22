import { ipcWebContentsSend } from "#shared/ipc/ipc.js";
import { Injectable, getWindow } from "@devisfuture/electron-modular";

@Injectable()
export class SendUpdateInfoService {
  constructor() {}

  sendUpdateInfo(payload: TUpdateData) {
    const updateWindow = getWindow<TWindows["updateApp"]>("window:update-app");
    const mainWindow = getWindow<TWindows["main"]>("window:main");

    if (updateWindow !== undefined || mainWindow !== undefined) {
      [updateWindow, mainWindow].forEach((window) => {
        if (window !== undefined) {
          ipcWebContentsSend("updateApp", window.webContents, payload);
        }
      });
    }
  }
}
