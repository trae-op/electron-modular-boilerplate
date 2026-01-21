import { bootstrapModules, initSettings } from "@devisfuture/electron-modular";
import dotenv from "dotenv";
import { BrowserWindow, Menu, app } from "electron";
import path from "node:path";

import { folders, menu } from "#main/config.js";

import { createWindow } from "#main/@shared/control-window/create.js";
import { destroyWindows } from "#main/@shared/control-window/destroy.js";
import { buildMenu, getMenu } from "#main/@shared/menu/menu.js";
import { initNotification } from "#main/@shared/notification.js";
import { setStore } from "#main/@shared/store.js";
import {
  buildTray,
  destroyTray,
  getTrayMenu,
} from "#main/@shared/tray/tray.js";
import { isDev } from "#main/@shared/utils.js";

import { AppPreloadModule } from "#main/app-preload2/module.js";
import {
  handlePreloadSend,
  initializePreloadWindow,
} from "#main/app-preload/ipc.js";
import { handleInvoke as handleAppVersionInvoke } from "#main/app-version/ipc.js";
import { AppModule } from "#main/app/module.js";
import { handleSend as handleAuthSend } from "#main/auth/ipc.js";
import { crash } from "#main/crash/service.js";
import { handleSend as handleUpdaterSend } from "#main/updater/ipc.js";
import { controlUpdater } from "#main/updater/services/win/controlUpdater.js";
import { setFeedURL } from "#main/updater/services/win/setFeedURL.js";
import { openWindow as openUpdaterWindow } from "#main/updater/window.js";
import { handleSend as handleUserSend } from "#main/user/ipc.js";

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
  await bootstrapModules([AppPreloadModule, AppModule]);
});
