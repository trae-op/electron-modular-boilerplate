import {
  IpcHandler,
  type TParamOnInit,
  getWindow as getWindows,
} from "@devisfuture/electron-modular";

import { ipcMainOn, ipcWebContentsSend } from "#shared/ipc/ipc.js";
import { getElectronStorage } from "#shared/store.js";

import { restApi } from "../config.js";

import { cacheUser } from "#main/cache-responses.js";

import { AuthService } from "./service.js";

@IpcHandler()
export class AuthIpc {
  constructor(private authService: AuthService) {}

  onInit({ getWindow }: TParamOnInit<TWindows["auth"]>): void {
    const authWindow = getWindow("window:auth");
    const mainWindow = getWindows("window:main");

    ipcMainOn("windowAuth", async (_, { provider }) => {
      authWindow.create({
        loadURL: `${restApi.urls.base}${restApi.urls.baseApi}${restApi.urls.auth.base}${restApi.urls.auth[provider]}`,
        options: {
          webPreferences: {
            partition: "persist:auth",
          },
        },
      });
    });

    ipcMainOn("checkAuth", () => {
      const userId = getElectronStorage("userId");
      const userFromCache = cacheUser(userId);

      if (mainWindow !== undefined) {
        ipcWebContentsSend("auth", mainWindow.webContents, {
          isAuthenticated: Boolean(userFromCache),
        });
      }
    });

    ipcMainOn("logout", () => {
      if (mainWindow !== undefined) {
        this.authService.logout(mainWindow);
      }
    });
  }
}
