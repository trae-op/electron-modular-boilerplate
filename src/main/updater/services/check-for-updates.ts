import { isDev, isPlatform } from "#shared/utils.js";
import { Injectable } from "@devisfuture/electron-modular";
import pkg from "electron-updater";

import { CheckUpdateProcessService } from "./check-update-process.js";
import { ControlUpdateService } from "./mac-os/control-update.js";

const { autoUpdater } = pkg;

@Injectable()
export class CheckForUpdatesService {
  constructor(
    private controlUpdateService: ControlUpdateService,
    private checkUpdateProcessService: CheckUpdateProcessService,
  ) {}

  checkForUpdates() {
    if (this.checkUpdateProcessService.isUpdateProcess() || isDev()) {
      return;
    }

    if (isPlatform("win32")) {
      autoUpdater.checkForUpdates();
    } else {
      this.controlUpdateService.controlUpdate();
    }
  }
}
