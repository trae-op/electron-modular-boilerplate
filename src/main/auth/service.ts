import { BrowserWindow } from "electron";
import {
  Injectable,
} from "@devisfuture/electron-modular";
import {
  deleteFromElectronStorage,
  deleteStore,
} from "#shared/store.js";
import { ipcWebContentsSend } from "#shared/ipc/ipc.js";

@Injectable()
export class AuthService {
  constructor() {}

  logout(window: BrowserWindow) {
    deleteFromElectronStorage("authToken");
    deleteFromElectronStorage("response");
    deleteFromElectronStorage("userId");
    deleteStore("masterKey");
    ipcWebContentsSend('auth', window.webContents, {
      isAuthenticated: false,
    });
  }
}
