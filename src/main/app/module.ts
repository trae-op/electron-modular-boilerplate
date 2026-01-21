import { RgModule } from "@devisfuture/electron-modular";
import { MenuModule } from "../menu/module.js";
import { TrayModule } from "../tray/module.js";
import { TrayService } from "../tray/service.js";

import { UpdaterModule } from "../updater/module.js";
import { AuthModule } from "../auth/module.js";
import { AuthService } from "../auth/service.js";
import { AppIpc } from "./ipc.js";
import { AppService } from "./service.js";
import { AppWindow } from "./window.js";
import { MenuService } from "../menu/service.js";
import { CheckForUpdatesService } from "../updater/services/check-for-updates.js";
import { ControlUpdateWindowsPlatformService } from "../updater/services/windows/control-update.js";
import { SetFeedUrlService } from "../updater/services/windows/set-feed-url.js";
import {
  AUTH_PROVIDER,
  MENU_PROVIDER,
  TRAY_PROVIDER,
  UPDATER_PROVIDER,
} from "./tokens.js";
import type {
  TAuthProvider,
  TMenuProvider,
  TTrayProvider,
  TUpdaterProvider,
} from "./types.js";

@RgModule({
  imports: [MenuModule, TrayModule, UpdaterModule, AuthModule],
  ipc: [AppIpc],
  windows: [AppWindow],
  providers: [
    AppService,
    {
      provide: MENU_PROVIDER,
      useFactory: (menuService: MenuService): TMenuProvider => ({
        getMenu: () => menuService.menu,
        buildMenu: (items) => menuService.buildMenu(items),
      }),
      inject: [MenuService],
    },
    {
      provide: TRAY_PROVIDER,
      useFactory: (trayService: TrayService): TTrayProvider => ({
        getTray: () => trayService.trayMenu,
        buildTray: (items) => trayService.buildTray(items),
        destroyTray: () => trayService.destroyTray(),
      }),
      inject: [TrayService],
    },
    {
      provide: AUTH_PROVIDER,
      useFactory: (authService: AuthService): TAuthProvider => ({
        checkAuthenticated: (window) => authService.checkAuthenticated(window),
        setCheckAccessInterval: (window) =>
          authService.setCheckAccessInterval(window),
        logout: (window) => authService.logout(window),
      }),
      inject: [AuthService],
    },
    {
      provide: UPDATER_PROVIDER,
      useFactory: (
        setFeedUrlService: SetFeedUrlService,
        checkForUpdatesService: CheckForUpdatesService,
        controlUpdateWindowsPlatformService: ControlUpdateWindowsPlatformService,
      ): TUpdaterProvider => ({
        setFeedUrl: () => setFeedUrlService.setFeedURL(),
        checkForUpdates: () => checkForUpdatesService.checkForUpdates(),
        controlUpdateWindowsPlatform: () =>
          controlUpdateWindowsPlatformService.controlUpdate(),
      }),
      inject: [
        SetFeedUrlService,
        CheckForUpdatesService,
        ControlUpdateWindowsPlatformService,
      ],
    },
  ],
})
export class AppModule {}
