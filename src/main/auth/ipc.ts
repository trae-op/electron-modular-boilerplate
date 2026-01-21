import { session } from "electron";
import { restApi } from "../config.js";
import { IpcHandler, getWindow as getWindows, type TParamOnInit } from "@devisfuture/electron-modular";
import { ipcMainOn, ipcWebContentsSend } from "#shared/ipc/ipc.js";
import { AuthService } from "./service.js";
import { getElectronStorage } from "#shared/store.js";
import { cacheUser } from "#shared/cache-responses.js";

@IpcHandler()
export class AuthIpc {
  constructor(private authProvider: AuthService) {}

  onInit({ getWindow }: TParamOnInit<TWindows['auth']>): void {
    const authWindow = getWindow('window:auth');
    const mainWindow = getWindows("window:main");
    const authSession = session.fromPartition("persist:auth");

    ipcMainOn('windowAuth', async (_, { provider }) => {
      authWindow.create({
        loadURL: `${restApi.urls.base}${restApi.urls.baseApi}${restApi.urls.auth.base}${restApi.urls.auth[provider]}`,
        options: {
          webPreferences: {
            session: authSession,
          },
        },
      });
    });

    ipcMainOn('checkAuth', () => {
      const userId = getElectronStorage("userId");
      const userFromCache = cacheUser(userId);

      if (mainWindow !== undefined) {
        ipcWebContentsSend('auth', mainWindow.webContents, {
          isAuthenticated: Boolean(userFromCache),
        });
      }
    });

    ipcMainOn("logout", () => {
      if (mainWindow !== undefined) {
        this.authProvider.logout(mainWindow);
      }
    });
  }
}
