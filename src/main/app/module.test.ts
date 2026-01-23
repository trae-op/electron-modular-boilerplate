import "reflect-metadata";
import { describe, expect, it } from "vitest";

import { MenuModule } from "#main/menu/module.js";
import { TrayModule } from "#main/tray/module.js";
import { UpdaterModule } from "#main/updater/module.js";

import { AppIpc } from "./ipc.js";
import { AppModule } from "./module.js";
import { AppService } from "./service.js";
import { MENU_PROVIDER, TRAY_PROVIDER, UPDATER_PROVIDER } from "./tokens.js";
import { AppWindow } from "./window.js";

describe("AppModule", () => {
  it("registers module metadata", () => {
    const metadata = Reflect.getMetadata("RgModule", AppModule);

    expect(metadata).toBeDefined();
    expect(metadata.imports).toEqual([MenuModule, TrayModule, UpdaterModule]);
    expect(metadata.ipc).toEqual([AppIpc]);
    expect(metadata.windows).toEqual([AppWindow]);
    expect(metadata.providers).toEqual(
      expect.arrayContaining([
        AppService,
        expect.objectContaining({ provide: MENU_PROVIDER }),
        expect.objectContaining({ provide: TRAY_PROVIDER }),
        expect.objectContaining({ provide: UPDATER_PROVIDER }),
      ]),
    );
  });
});
