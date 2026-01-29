import {
  IpcHandler,
  type TParamOnInit,
  getWindow as getWindows,
} from "@devisfuture/electron-modular";
import { BrowserWindow } from "electron";
import { B } from "vitest/dist/chunks/worker.d.1GmBbd7G.js";

import {
  ipcMainHandle,
  ipcMainOn,
  ipcWebContentsSend,
} from "#shared/ipc/ipc.js";

import { ConfirmService } from "./service.js";

@IpcHandler()
export class ConfirmIpc {
  private confirmWindow: BrowserWindow | undefined = undefined;
  constructor(private confirmService: ConfirmService) {}

  onInit({ getWindow }: TParamOnInit<TWindows["confirm"]>): void {
    const confirmWindow = getWindow("window:confirm");
    const mainWindow = getWindows<TWindows["main"]>("window:main");

    ipcMainOn("windowConfirm", async () => {
      this.confirmWindow = await confirmWindow.create();
    });

    ipcMainHandle("confirmData", async (data) => {
      if (data === undefined) {
        return;
      }

      const result = await this.confirmService.transformData(data);

      if (mainWindow !== undefined) {
        ipcWebContentsSend("confirm", mainWindow.webContents, result);
        this.confirmWindow?.hide();
      }

      return {
        success: true,
      };
    });
  }
}
