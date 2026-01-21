import { BrowserWindow } from "electron";

export function destroyWindows() {
  const windows = BrowserWindow.getAllWindows();
  if (windows.length > 0) {
    windows.forEach((window) => {
      if (!window.isDestroyed()) {
        window.destroy();
      }
    });
  }
}
