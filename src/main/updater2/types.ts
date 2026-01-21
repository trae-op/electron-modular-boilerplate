import type { Notification, NotificationConstructorOptions } from "electron";
import type { TItem as TTrayItem } from "../tray/types.js";

export type TUpdaterTrayProvider = {
  getTray: () => TTrayItem[];
  buildTray: (items?: TTrayItem[]) => void;
  destroyTray: () => void;
};

export type TUpdaterNotificationProvider = {
  initNotification: () => void;
  setNotification: (
    options: Partial<NotificationConstructorOptions>
  ) => Notification | undefined;
};
