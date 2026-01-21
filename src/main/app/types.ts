import { type BrowserWindow } from "electron/main";

import type { TItem as TItemMenu } from "#main/@shared/menu/types.js";
import type { TItem as TItemTray } from "#main/@shared/tray/types.js";

export type TDestroyProcess = {
  error?: any;
  message: string;
  title: string;
};

export type TMenuProvider = {
  collect: (window: BrowserWindow, items?: TItemMenu[]) => void;
};

export type TTrayProvider = {
  collect: (window: BrowserWindow, items?: TItemTray[]) => void;
  destroy: () => void;
};
