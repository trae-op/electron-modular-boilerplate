import { Injectable } from "@devisfuture/electron-modular";
import { Notification, type NotificationConstructorOptions } from "electron";

import { getAssetsPath } from "#shared/path-resolver.js";
import { joinPosixPath } from "#shared/utils.js";

import { icons } from "../config.js";

let notification: Notification | undefined = undefined;

@Injectable()
export class NotificationService {
  constructor() {}

  initNotification(): void {
    notification = new Notification({
      icon: joinPosixPath(getAssetsPath(), icons.notificationIcon),
    });
  }

  setNotification(
    options: Partial<NotificationConstructorOptions>,
  ): Notification | undefined {
    if (notification !== undefined) {
      notification = Object.assign(notification, options);
    }

    return notification;
  }
}
