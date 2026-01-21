import { getWindow } from "../control-window/receive.js";
import { sendToRenderer } from "../ipc/ipc.js";
import { deleteFromElectronStorage } from "../store.js";

export async function logout() {
  const mainWindow = getWindow<TWindows["main"]>("window:main");

  if (mainWindow !== undefined) {
    deleteFromElectronStorage("authToken");
    deleteFromElectronStorage("response");
    deleteFromElectronStorage("userId");
    sendToRenderer(mainWindow.webContents, {
      type: "auth",
      data: {
        isAuthenticated: false,
      },
    });
  }
}
