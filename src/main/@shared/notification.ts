import { Notification } from "electron";
import path from "node:path";

import { icons } from "../config.js";

import { getAssetsPath } from "./path-resolver.js";

export let notification: Notification | undefined = undefined;

export function initNotification() {
  notification = new Notification({
    icon: path.join(getAssetsPath(), icons.notificationIcon),
  });
}
