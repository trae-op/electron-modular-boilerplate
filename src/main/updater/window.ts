import { WindowManager } from "@devisfuture/electron-modular";

import type { TWindowManager } from "../types.js";
import { CheckForUpdatesService } from "./services/check-for-updates.js";

@WindowManager<TWindows["updateApp"]>({
  hash: "window:update-app",
  isCache: true,
  options: {
    width: 365,
    height: 365,
    autoHideMenuBar: true,
    minimizable: false,
    maximizable: false,
    title: "",
  },
})
export class UpdaterWindow implements TWindowManager {
  constructor(private checkForUpdatesService: CheckForUpdatesService) {}

  onWebContentsDidFinishLoad(): void {
    this.checkForUpdatesService.checkForUpdates();
  }

  onShow() {
    this.checkForUpdatesService.checkForUpdates();
  }
}
