import { getWindow } from "#main/@shared/control-window/receive.js";
import { type TSendHandler } from "#main/@shared/ipc/types.js";

import { openWindow } from "#main/app-preload/window.js";

export const initializePreloadWindow = () => {
  openWindow();
};

export const handlePreloadSend: TSendHandler = async ({ payload }) => {
  if (payload.type !== "windowClosePreload") {
    return;
  }

  const mainWindow = getWindow<TWindows["main"]>("window:main");
  const preloadAppWindow =
    getWindow<TWindows["preloadApp"]>("window:preload-app");

  if (preloadAppWindow !== undefined) {
    preloadAppWindow.hide();
  }

  if (mainWindow !== undefined) {
    mainWindow.show();
  }
};
