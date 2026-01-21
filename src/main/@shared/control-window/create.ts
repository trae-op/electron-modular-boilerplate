import { BrowserWindow, app, session } from "electron";
import path from "node:path";

import { appName, folders } from "../../config.js";

import { cacheWindows } from "./cache.js";
import { getWindow } from "./receive.js";
import type { TParamsCreateWindow } from "./types.js";

export function createWindow<N extends string>({
  hash,
  options,
  isCache,
  loadURL,
}: TParamsCreateWindow<N>) {
  const BASE_REST_API = process.env.BASE_REST_API;
  const LOCALHOST_PORT = process.env.LOCALHOST_PORT;
  const isDev = process.env.NODE_ENV === "development";
  const uiPath = path.join(
    app.getAppPath(),
    "/" + folders.distRenderer + "/index.html",
  );
  const preloadPath = path.join(
    app.getAppPath(),
    isDev ? "." : "..",
    "/" + folders.distMain + "/preload.cjs",
  );

  if (!LOCALHOST_PORT && isDev) {
    console.warn(
      `Warning: You have to add an environment variable called "process.env.LOCALHOST_PORT"!`,
    );
  }

  const hasWindow = hash ? cacheWindows.has(hash) : undefined;

  if (hash && hasWindow && hasWindow && isCache) {
    const existingWindow = getWindow(hash);
    if (existingWindow) {
      existingWindow.show();

      return existingWindow;
    }
  }

  const newWindow = new BrowserWindow({
    ...(options || {}),
    title: appName,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      ...(options ? options.webPreferences : {}),
    },
  });

  if (isCache && !loadURL) {
    const csp = `
  default-src 'self';
  ${BASE_REST_API !== undefined ? `connect-src 'self' ${BASE_REST_API};` : ""}
  img-src * data:;
  style-src 'self' 'unsafe-inline';
  script-src 'self' ${isDev ? "'unsafe-inline'" : ""};
`
      .replace(/\s{2,}/g, " ")
      .trim();

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          "Content-Security-Policy": [csp],
        },
      });
    });
  }

  if (loadURL) {
    newWindow.loadURL(loadURL);
  }

  if (!loadURL && isDev) {
    newWindow.loadURL(
      `http://localhost:${process.env.LOCALHOST_PORT}${
        hash !== undefined ? `#${hash}` : ""
      }`,
    );
  }

  if (!loadURL && !isDev && hash) {
    newWindow.loadFile(uiPath, {
      hash,
    });
  }

  if (hash && isCache) {
    cacheWindows.set(hash, newWindow);

    if (cacheWindows.has(hash)) {
      const existingWindow = cacheWindows.get(hash);

      if (existingWindow) {
        existingWindow.on("close", (event) => {
          event.preventDefault();
          existingWindow.hide();
        });
      }
    }
  }

  return newWindow;
}
