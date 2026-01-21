import { BrowserWindow, session } from "electron";

import { restApi } from "#main/config.js";

import { createWindow } from "#main/@shared/control-window/create.js";

import { TLessProviders } from "#main/auth/types.js";

export function openWindow(provider: keyof TLessProviders): BrowserWindow {
  const authSession = session.fromPartition("persist:auth");

  return createWindow<TWindows["auth"]>({
    hash: "window:auth",
    loadURL: `${restApi.urls.base}${restApi.urls.baseApi}${restApi.urls.auth.base}${restApi.urls.auth[provider]}`,
    options: {
      autoHideMenuBar: true,
      minimizable: false,
      maximizable: false,
      title: "",
      width: 400,
      height: 400,
      webPreferences: {
        session: authSession,
      },
    },
  });
}
