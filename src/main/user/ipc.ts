import { ipcMainOn } from "#shared/ipc/ipc.js";
import { getElectronStorage } from "#shared/store.js";
import {
  IpcHandler,
  getWindow as getWindows,
} from "@devisfuture/electron-modular";

import { cacheUser } from "#main/cache-responses.js";

import { UserService } from "./service.js";

@IpcHandler()
export class UserIpc {
  constructor(private userService: UserService) {}

  onInit(): void {
    ipcMainOn("user", async (event) => {
      const userId = getElectronStorage("userId");
      const getCacheUser = cacheUser(userId);
      const mainWindow = getWindows<TWindows["main"]>("window:main");

      if (mainWindow !== undefined) {
        if (getCacheUser !== undefined) {
          event.reply("user", {
            user: getCacheUser,
          });
        }

        const user = userId ? await this.userService.byId(userId) : undefined;
        if (user !== undefined) {
          event.reply("user", {
            user,
          });
        }
      }
    });
  }
}
