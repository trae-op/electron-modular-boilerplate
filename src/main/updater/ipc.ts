import { ipcMainOn } from "#shared/ipc/ipc.js";
import {
  Inject,
  IpcHandler,
  type TIpcHandlerInterface,
  type TParamOnInit,
  destroyWindows,
} from "@devisfuture/electron-modular";
import { BrowserWindow, app } from "electron";
import pkg from "electron-updater";

import { OpenLatestVersionService } from "./services/mac-os/open-latest-version.js";
import { UPDATER_TRAY_PROVIDER } from "./tokens.js";
import type { TTrayProvider } from "./types.js";

const { autoUpdater } = pkg;

@IpcHandler()
export class UpdaterIpc implements TIpcHandlerInterface {
  private updateAppWindow: BrowserWindow | undefined = undefined;

  constructor(
    @Inject(UPDATER_TRAY_PROVIDER) private trayProvider: TTrayProvider,
    private openLatestVersionService: OpenLatestVersionService,
  ) {}

  onInit({ getWindow }: TParamOnInit<TWindows["updateApp"]>) {
    const updateAppWindow = getWindow("window:update-app");

    this.trayProvider.collect(
      this.trayProvider.getMenu().map((item) => {
        if (item.name === "check-update") {
          item.click = async () => {
            if (this.updateAppWindow) {
              this.updateAppWindow.show();
            } else {
              this.updateAppWindow = await updateAppWindow.create();
            }
          };
        }

        return item;
      }),
    );

    ipcMainOn("restart", () => {
      autoUpdater.quitAndInstall();
    });

    ipcMainOn("openLatestVersion", (_, { updateFile }) => {
      this.openLatestVersionService.openLatestVersion(updateFile);
      this.trayProvider.destroy();
      destroyWindows();
      app.quit();
    });
  }
}
