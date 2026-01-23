import type { TMenuItem } from "#main/types.js";

export type TDestroyProcess = {
  error?: any;
  message: string;
  title: string;
};

export type TMenuProvider = {
  getMenu: () => TMenuItem[];
  collect: (items?: TMenuItem[]) => void;
};

export type TTrayProvider = {
  getMenu: () => TMenuItem[];
  collect: (items?: TMenuItem[]) => void;
  destroy: () => void;
};

export type TUpdaterProvider = {
  checkForUpdates: () => void;
};
