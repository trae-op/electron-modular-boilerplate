import { Injectable } from "@devisfuture/electron-modular";
import { BrowserWindow, session } from "electron";

import { ipcWebContentsSend } from "#shared/ipc/ipc.js";
import { deleteFromElectronStorage, deleteStore } from "#shared/store.js";

import { showErrorMessages } from "#main/@shared/error-messages.js";

@Injectable()
export class AuthService {
  constructor() {}

  async clearStorageData() {
    try {
      await session.fromPartition("persist:auth").clearStorageData();
    } catch (error) {
      showErrorMessages({
        title: "Error clearing auth storage data",
        body: (error as Error).message,
      });
    }
  }

  logout(window: BrowserWindow) {
    deleteFromElectronStorage("authToken");
    deleteFromElectronStorage("response");
    deleteFromElectronStorage("userId");
    deleteStore("masterKey");
    ipcWebContentsSend("auth", window.webContents, {
      isAuthenticated: false,
    });
    this.clearStorageData();
  }
}
