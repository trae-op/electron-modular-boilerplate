import type { BrowserWindow } from "electron";

import type { TItem } from "#main/@shared/tray/types.js";

export type TDestroyProcess = {
  error?: any;
  message: string;
  title: string;
};

export type TMenuProvider = {
  getMenu: () => TItem[];
  buildMenu: (items?: TItem[]) => void;
};

export type TTrayProvider = {
  getTray: () => TItem[];
  buildTray: (items?: TItem[]) => void;
  destroyTray: () => void;
};

export type TAuthProvider = {
  checkAuthenticated: (
    window: BrowserWindow,
  ) => { isAuthenticated: boolean } | undefined;
  setCheckAccessInterval: (window: BrowserWindow) => void;
  logout: (window: BrowserWindow) => void;
};

export type TUpdaterProvider = {
  setFeedUrl: () => void;
  checkForUpdates: () => void;
  controlUpdateWindowsPlatform: () => void;
};
