import {
  IpcHandler,
  type TIpcHandlerInterface,
} from "@devisfuture/electron-modular";
import { app } from "electron";

import { ipcMainHandle } from "#shared/ipc/ipc.js";

@IpcHandler()
export class AppVersionIpc implements TIpcHandlerInterface {
  constructor() {}

  onInit() {
    const currentVersion = app.getVersion();
    ipcMainHandle("getVersion", () => currentVersion);
  }
}
