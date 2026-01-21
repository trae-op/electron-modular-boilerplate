import { app } from "electron";
import { Inject, Injectable, getWindow } from "@devisfuture/electron-modular";
import { TRAY_PROVIDER } from "./tokens.js";
import type { TTrayProvider } from "./types.js";

@Injectable()
export class AppService {
  constructor(@Inject(TRAY_PROVIDER) private trayProvider: TTrayProvider) {}

  destroyTrayAndWindows(): void {
    this.trayProvider.destroy();
    const preloadAppWindow =
      getWindow<TWindows["preloadApp"]>("window:preload-app");

    if (preloadAppWindow !== undefined) {
      preloadAppWindow.destroy();
    }
  }

  dockHide() {
    if (app.dock) {
      app.dock.hide();
    }
  }
}
