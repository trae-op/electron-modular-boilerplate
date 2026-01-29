import dotenv from "dotenv";
import path from "node:path";

import { isDev } from "#shared/utils.js";

const envPath = path.join(
  process.env.RESOURCES_PATH ?? process.resourcesPath,
  ".env",
);
dotenv.config(!isDev() ? { path: envPath } : undefined);

type GetPathMethod = Electron.App["getPath"];
type AppPathName = Parameters<GetPathMethod>[0];

export const appName = "Electron React Auth Updater";

export const windows: TWindows = {
  main: "window:main",
  updateApp: "window:update-app",
  preloadApp: "window:preload-app",
  auth: "window:auth",
  confirm: "window:confirm",
};

export const folders = {
  distRenderer: "dist-renderer",
  distMain: "dist-main",
  downloadLatestVersion: {
    macos: {
      root: "downloads" as AppPathName,
      app: "app-update",
    },
  },
};

export const menu = {
  labels: {
    app: "App",
    checkUpdate: "Check for updates...",
    showApp: "Show",
    quit: "Quit",
    devTools: "Developer tools",
  },
};

export const icons = {
  trayIconTemplate: "trayIconTemplate.png",
  trayIcon: "trayIcon.png",
  notificationIcon: "72x72.png",
};

export const messages = {
  autoUpdater: {
    checkingForUpdate: "Checking for update...",
    updateNotAvailable: "Update not available",
    updateAvailable: "Update available",
    updateDownloaded: "Update downloaded",
    notificationTitle: "New updates",
    fetchError: "Failed to fetch update info",
    notificationBody: "Your app has new updates!",
    error: "Something wrong!",
    errorCreatingFolder: "Unknown error creating folder",
    errorOpenFolder: "Failed to open folder",
    errorVerifyDownload: "File does not exist",
  },
  crash: {
    uncaughtException: "Uncaught synchronous error in main process!",
    unhandledRejection: "Unhandled Promise failure in main process!",
    renderProcessGone: "The renderer process terminated unexpectedly!",
  },
  auth: {
    errorTokenUserMissing: "Token or userId is missing!",
    userAlreadyExists: "User already exists!",
  },
};

export const publishOptions = {
  repo: "electron-modular-boilerplate",
  owner: "trae-op",
};

export const restApi = {
  urls: {
    base: process.env.BASE_REST_API,
    baseApi: "/api",
    auth: {
      base: "/auth",
      google: "/google",
      github: "/github",
    },
    user: {
      base: "/user",
      byId: (id: string) => `/${id}`,
    },
    githubReleases: `https://api.github.com/repos/${publishOptions.owner}/${publishOptions.repo}/releases`,
  },
};
