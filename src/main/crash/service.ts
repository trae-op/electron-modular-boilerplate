import { app, dialog } from "electron";

import { messages } from "../config.js";

import { getWindow } from "../@shared/control-window/receive.js";
import { destroyTray } from "../@shared/tray/tray.js";

import { TDestroyProcess } from "./types.js";

export function crash() {
  process.on("uncaughtException", (error) => {
    destroyProcess({
      error,
      message: error.message,
      title: messages.crash.uncaughtException,
    });
  });

  process.on("unhandledRejection", (reason) => {
    destroyProcess({
      error: reason,
      message: messages.crash.unhandledRejection,
      title: messages.crash.unhandledRejection,
    });
  });

  app.on("render-process-gone", (_event, _webContents, details) => {
    destroyProcess({
      error: details,
      message: `Exit Code: ${details.exitCode}, Reason: ${details.reason}`,
      title: messages.crash.renderProcessGone,
    });
  });
}

function destroyTrayAndWindows() {
  destroyTray();
  const preloadAppWindow =
    getWindow<TWindows["preloadApp"]>("window:preload-app");

  if (preloadAppWindow !== undefined) {
    preloadAppWindow.destroy();
  }
}

function destroyProcess({ error, message, title }: TDestroyProcess) {
  if (error !== undefined) {
    console.error(error);
  }

  destroyTrayAndWindows();
  dockHide();

  dialog.showMessageBox({
    title,
    message,
  });
}

function dockHide() {
  if (app.dock) {
    app.dock.hide();
  }
}
