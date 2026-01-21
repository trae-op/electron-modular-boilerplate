import type { Notification, NotificationConstructorOptions } from "electron";

import type { TMenuItem } from "#main/types.js";

export type TTrayProvider = {
  getMenu: () => TMenuItem[];
  collect: (items?: TMenuItem[]) => void;
  destroy: () => void;
};

export type TUpdaterNotificationProvider = {
  initNotification: () => void;
  setNotification: (
    options: Partial<NotificationConstructorOptions>,
  ) => Notification | undefined;
};
