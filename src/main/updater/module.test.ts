import "reflect-metadata";
import { describe, expect, it } from "vitest";

import { NotificationModule } from "#main/notification/module.js";
import { TrayModule } from "#main/tray/module.js";

import { UpdaterIpc } from "./ipc.js";
import { UpdaterModule } from "./module.js";
import {
  UPDATER_NOTIFICATION_PROVIDER,
  UPDATER_TRAY_PROVIDER,
} from "./tokens.js";
import { UpdaterWindow } from "./window.js";

describe("UpdaterModule", () => {
  it("registers module metadata", () => {
    const metadata = Reflect.getMetadata("RgModule", UpdaterModule);

    expect(metadata).toBeDefined();
    expect(metadata.imports).toEqual([TrayModule, NotificationModule]);
    expect(metadata.ipc).toEqual([UpdaterIpc]);
    expect(metadata.windows).toEqual([UpdaterWindow]);
    expect(metadata.providers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ provide: UPDATER_TRAY_PROVIDER }),
        expect.objectContaining({ provide: UPDATER_NOTIFICATION_PROVIDER }),
      ]),
    );
  });
});
