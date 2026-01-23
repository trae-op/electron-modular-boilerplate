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
  private isCheckFirst = true;
  constructor(private checkForUpdatesService: CheckForUpdatesService) {}

  onWebContentsDidFinishLoad(): void {
    if (this.isCheckFirst) {
      this.checkForUpdatesService.checkForUpdates();
      this.isCheckFirst = false;
    }
  }

  onShow() {
    if (!this.isCheckFirst) {
      this.checkForUpdatesService.checkForUpdates();
    }
  }
}
