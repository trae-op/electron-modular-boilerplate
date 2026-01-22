import { ipcMainHandle } from "#shared/ipc/ipc.js";
import {
  IpcHandler,
  type TIpcHandlerInterface,
} from "@devisfuture/electron-modular";
import { app } from "electron";

@IpcHandler()
export class AppVersionIpc implements TIpcHandlerInterface {
  constructor() {}

  onInit() {
    const currentVersion = app.getVersion();
    ipcMainHandle("getVersion", () => currentVersion);
  }
}
