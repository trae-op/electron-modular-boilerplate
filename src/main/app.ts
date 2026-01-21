import { isDev } from "#shared/utils.js";
import { bootstrapModules, initSettings } from "@devisfuture/electron-modular";
import dotenv from "dotenv";
import { Menu, app } from "electron";
import path from "node:path";

import { folders } from "#main/config.js";

import { AppPreloadModule } from "#main/app-preload/module.js";
import { AppVersionModule } from "#main/app-version/module.js";
import { AppModule } from "#main/app/module.js";
import { AuthModule } from "#main/auth/module.js";
import { NotificationModule } from "#main/notification/module.js";
import { UpdaterModule } from "#main/updater/module.js";
import { UserModule } from "#main/user/module.js";

const envPath = path.join(process.resourcesPath, ".env");
dotenv.config(!isDev() ? { path: envPath } : undefined);

app.disableHardwareAcceleration();

Menu.setApplicationMenu(null);

const source = process.env.BASE_REST_API;
initSettings({
  cspConnectSources: source ? [source] : [],
  localhostPort: process.env.LOCALHOST_ELECTRON_SERVER_PORT ?? "",
  folders: {
    distRenderer: folders.distRenderer,
    distMain: folders.distMain,
  },
});

app.on("ready", async () => {
  await bootstrapModules([
    AppPreloadModule,
    AppModule,
    AuthModule,
    UserModule,
    NotificationModule,
    UpdaterModule,
    AppVersionModule,
  ]);
});
