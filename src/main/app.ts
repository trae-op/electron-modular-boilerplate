import dotenv from "dotenv";
import { BrowserWindow, Menu, app } from "electron";
import path from "node:path";

import { menu } from "#main/config.js";

import { createWindow } from "#main/@shared/control-window/create.js";
import { destroyWindows } from "#main/@shared/control-window/destroy.js";
import { registerIpc } from "#main/@shared/ipc/ipc.js";
import { buildMenu, getMenu } from "#main/@shared/menu/menu.js";
import { initNotification } from "#main/@shared/notification.js";
import { setStore } from "#main/@shared/store.js";
import {
  buildTray,
  destroyTray,
  getTrayMenu,
} from "#main/@shared/tray/tray.js";
import { isDev } from "#main/@shared/utils.js";

import {
  handlePreloadSend,
  initializePreloadWindow,
} from "#main/app-preload/ipc.js";
import { handleInvoke as handleAppVersionInvoke } from "#main/app-version/ipc.js";
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

setFeedURL();

crash();

function initMenu(currentWindow: BrowserWindow) {
  buildMenu(currentWindow, (window) => {
    return getMenu().map((item) => {
      if (item.name === "app") {
        item.submenu = [
          {
            label: menu.labels.devTools,
            click: () => window.webContents.openDevTools(),
          },
        ];
      }

      return item;
    });
  });
}

app.on("ready", async () => {
  const mainWindow = createWindow<TWindows["main"]>({
    hash: "window:main",
    isCache: true,
    options: {
      show: false,
      width: 600,
      height: 500,
    },
  });

  initNotification();

  buildTray(
    getTrayMenu().map((item) => {
      if (item.name === "show") {
        item.click = () => {
          mainWindow.show();

          if (app.dock) {
            app.dock.show();
          }
        };
      }

      if (item.name === "check-update") {
        item.click = () => {
          openUpdaterWindow();
        };
      }

      return item;
    }),
  );

  initMenu(mainWindow);

  initializePreloadWindow();

  registerIpc({
    onSend: (args) => {
      handleAuthSend(args);
      handleUserSend(args);
      handlePreloadSend(args);
      handleUpdaterSend(args);
    },
    onInvoke: (args) => {
      return handleAppVersionInvoke(args);
    },
  });

  handleCloseEvents(mainWindow);
});

function handleCloseEvents(mainWindow: BrowserWindow) {
  let isWillClose = false;

  mainWindow.on("close", (event) => {
    if (isWillClose) {
      return;
    }

    event.preventDefault();
    mainWindow.hide();
    if (app.dock) {
      app.dock.hide();
    }
  });

  app.on("before-quit", async () => {
    isWillClose = true;

    destroyTray();
    destroyWindows();
  });

  mainWindow.on("show", () => {
    setStore("/", mainWindow);
    isWillClose = false;
  });
}

controlUpdater();
