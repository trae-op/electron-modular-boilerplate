import { RgModule } from "@devisfuture/electron-modular";

import { MenuModule } from "#main/menu/module.js";
import { MenuService } from "#main/menu/service.js";

import { TrayModule } from "#main/tray/module.js";
import { TrayService } from "#main/tray/service.js";

import { AppIpc } from "./ipc.js";
import { AppService } from "./service.js";
import { AppWindow } from "./window.js";
import {
  MENU_PROVIDER,
  TRAY_PROVIDER,
} from "./tokens.js";
import type {
  TMenuProvider,
  TTrayProvider,
} from "./types.js";

@RgModule({
  imports: [MenuModule, TrayModule],
  ipc: [AppIpc],
  windows: [AppWindow],
  providers: [
    AppService,
    {
      provide: MENU_PROVIDER,
      useFactory: (menuService: MenuService): TMenuProvider => ({
        collect: (window, items) => menuService.collectMenu(window, items),
      }),
      inject: [MenuService],
    },
    {
      provide: TRAY_PROVIDER,
      useFactory: (trayService: TrayService): TTrayProvider => ({
        collect: (window, items) => trayService.collect(window, items),
        destroy: () => trayService.destroy(),
      }),
      inject: [TrayService],
    }
  ],
})
export class AppModule {}
