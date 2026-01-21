import { type Event, type WebContentsWillRedirectEventParams } from "electron";

import { messages } from "#main/config.js";

import { cacheUser } from "#main/@shared/cache-responses.js";
import { getWindow } from "#main/@shared/control-window/receive.js";
import { showErrorMessages } from "#main/@shared/error-messages.js";
import { sendToRenderer } from "#main/@shared/ipc/ipc.js";
import { type TSendHandler } from "#main/@shared/ipc/types.js";
import { logout } from "#main/@shared/services/logout.js";
import { getElectronStorage, setElectronStorage } from "#main/@shared/store.js";

import { openWindow } from "#main/auth/window.js";

export const handleSend: TSendHandler = ({ payload }) => {
  const { type, data } = payload;

  if (type === "logout") {
    logout();
    return;
  }

  if (type === "checkAuth") {
    const mainWindow = getWindow<TWindows["main"]>("window:main");
    const userId = getElectronStorage("userId");
    const userFromCache = cacheUser(userId);

    if (mainWindow !== undefined) {
      sendToRenderer(mainWindow.webContents, {
        type: "auth",
        data: {
          isAuthenticated: Boolean(userFromCache),
        },
      });
    }

    return;
  }

  if (type !== "windowAuth" || data === undefined || !("provider" in data)) {
    return;
  }

  const window = openWindow(data.provider);
  const mainWindow = getWindow<TWindows["main"]>("window:main");

  window.webContents.on(
    "will-redirect",
    async (_: Event<WebContentsWillRedirectEventParams>, url: string) => {
      const isVerify = /api\/auth\/verify\?token\=/g.test(url);
      const isUserExists = /api\/auth\/user\-exists\?message\=/g.test(url);
      const callBackUrl = new URL(url);
      const searchParams = new URLSearchParams(callBackUrl.search);

      if (isUserExists) {
        window.close();
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

        if (token !== null && userId !== null && mainWindow !== undefined) {
          setElectronStorage("authToken", token);
          setElectronStorage("userId", userId);
          sendToRenderer(mainWindow.webContents, {
            type: "auth",
            data: {
              isAuthenticated: true,
            },
          });
        } else {
          showErrorMessages({
            title: messages.auth.errorTokenUserMissing,
            body: `Token=${token}\nUserId: ${userId}`,
          });
        }

        window.close();
      }
    },
  );
};
