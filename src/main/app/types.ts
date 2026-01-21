import { type BrowserWindow } from "electron/main";

import type { TMenuItem } from "#main/types.js";

export type TDestroyProcess = {
  error?: any;
  message: string;
  title: string;
};

export type TMenuProvider = {
  collect: (window: BrowserWindow, items?: TMenuItem[]) => void;
};

export type TTrayProvider = {
  collect: (window: BrowserWindow, items?: TMenuItem[]) => void;
  destroy: () => void;
};
