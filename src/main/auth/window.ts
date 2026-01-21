import {
  BrowserWindow,
  type Event,
  type WebContentsWillRedirectEventParams,
} from "electron";
import { WindowManager } from "@devisfuture/electron-modular";
import { setElectronStorage } from "@shared/store.js";
import { ipcWebContentsSend } from "@shared/ipc/ipc.js";

import { messages } from "../config.js";
import type { TWindowManager } from "../types.js";
import { showErrorMessages } from "#main/@shared/error-messages.js";

@WindowManager<TWindows['auth']>({
  hash: 'window:auth',
  options: {
    autoHideMenuBar: true,
    minimizable: false,
    maximizable: false,
    title: "",
    width: 400,
    height: 400,
  },
})
export class AuthWindow implements TWindowManager {
  private window: BrowserWindow | undefined;

  constructor() {}

  onWebContentsDidFinishLoad(window: BrowserWindow): void {
    this.window = window;
  }

  onWebContentsWillRedirect(
    _: Event<WebContentsWillRedirectEventParams>,
    url: string,
  ): void {
    const isVerify = /api\/auth\/verify\?token\=/g.test(url);
    const isUserExists = /api\/auth\/user\-exists\?message\=/g.test(url);
    const callBackUrl = new URL(url);
    const searchParams = new URLSearchParams(callBackUrl.search);

    if (isUserExists) {
      this.window?.close();
      const message = searchParams.get("message");
      const email = searchParams.get("email");

      if (message !== null && email !== null) {
        showErrorMessages({
          title: messages.auth.userAlreadyExists,
          body: `${message}\nEmail: ${email}`,
        });
      }
    }

    if (isVerify) {
      const token = searchParams.get("token");
      const userId = searchParams.get("userId");

      if (token !== null && userId !== null && this.window !== undefined) {
        setElectronStorage("authToken", token);
        setElectronStorage("userId", userId);
        ipcWebContentsSend("auth", this.window.webContents, {
          isAuthenticated: true,
        });
      } else {
        showErrorMessages({
          title: messages.auth.errorTokenUserMissing,
          body: `Token=${token}\nUserId: ${userId}`,
        });
      }

      window.close();
    }
  }
}
