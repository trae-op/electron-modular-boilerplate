import { RgModule } from "@devisfuture/electron-modular";

import { MenuModule } from "#main/menu/module.js";
import { MenuService } from "#main/menu/service.js";
import { TrayModule } from "#main/tray/module.js";
import { TrayService } from "#main/tray/service.js";
import { UpdaterModule } from "#main/updater/module.js";
import { CheckForUpdatesService } from "#main/updater/services/check-for-updates.js";

import { AppIpc } from "./ipc.js";
import { AppService } from "./service.js";
import { MENU_PROVIDER, TRAY_PROVIDER, UPDATER_PROVIDER } from "./tokens.js";
import type {
  TMenuProvider,
  TTrayProvider,
  TUpdaterProvider,
} from "./types.js";
import { AppWindow } from "./window.js";

@RgModule({
  imports: [MenuModule, TrayModule, UpdaterModule],
  ipc: [AppIpc],
  windows: [AppWindow],
  providers: [
    AppService,
    {
      provide: MENU_PROVIDER,
      useFactory: (menuService: MenuService): TMenuProvider => ({
        getMenu: () => menuService.getMenu(),
        collect: (items) => menuService.collectMenu(items),
      }),
      inject: [MenuService],
    },
    {
      provide: TRAY_PROVIDER,
      useFactory: (trayService: TrayService): TTrayProvider => ({
        getMenu: () => trayService.getMenu(),
        collect: (items) => trayService.collect(items),
        destroy: () => trayService.destroy(),
      }),
      inject: [TrayService],
    },
    {
      provide: UPDATER_PROVIDER,
      useFactory: (
        updaterService: CheckForUpdatesService,
      ): TUpdaterProvider => ({
        checkForUpdates: () => updaterService.checkForUpdates(),
      }),
      inject: [CheckForUpdatesService],
    },
  ],
})
export class AppModule {}
