import { ipcWebContentsSend } from "#shared/ipc/ipc.js";
import { deleteFromElectronStorage, deleteStore } from "#shared/store.js";
import { Injectable } from "@devisfuture/electron-modular";
import { BrowserWindow } from "electron";

@Injectable()
export class AuthService {
  constructor() {}

  logout(window: BrowserWindow) {
    deleteFromElectronStorage("authToken");
    deleteFromElectronStorage("response");
    deleteFromElectronStorage("userId");
    deleteStore("masterKey");
    ipcWebContentsSend("auth", window.webContents, {
      isAuthenticated: false,
    });
  }
}
