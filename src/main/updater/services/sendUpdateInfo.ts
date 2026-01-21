import { getWindow } from "#main/@shared/control-window/receive.js";
import { sendToRenderer } from "#main/@shared/ipc/ipc.js";

export function sendUpdateInfo(payload: TUpdateData) {
  const updateWindow = getWindow<TWindows["updateApp"]>("window:update-app");
  const mainWindow = getWindow<TWindows["main"]>("window:main");

  [updateWindow, mainWindow].forEach((window) => {
    if (window !== undefined) {
      sendToRenderer(window.webContents, {
        type: "updateApp",
        data: payload,
      });
    }
  });
}
