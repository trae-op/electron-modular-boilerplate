import { RgModule } from "@devisfuture/electron-modular";
import { CheckForUpdateService } from "./services/mac-os/check-for-update.js";
import { VerifyService } from "./services/mac-os/verify.js";
import { CreateLatestVersionFolderService } from "./services/mac-os/create-latest-version-folder.js";
import { DownloadFileService } from "./services/mac-os/download-file.js";
import { ControlUpdateService } from "./services/mac-os/control-update.js";
import { ControlUpdateWindowsPlatformService } from "./services/windows/control-update.js";
import { SendUpdateInfoService } from "./services/send-update-info.js";
import { CheckUpdateProcessService } from "./services/check-update-process.js";
import { CheckForUpdatesService } from "./services/check-for-updates.js";
import { SetFeedUrlService } from "./services/windows/set-feed-url.js";
import { OpenLatestVersionService } from "./services/mac-os/open-latest-version.js";
import { UpdaterIpc } from "./ipc.js";
import { TrayModule } from "#main/tray/module.js";
import { TrayService } from "#main/tray/service.js";
import { NotificationModule } from "#main/notification/module.js";
import { NotificationService } from "#main/notification/service.js";
import { UpdaterWindow } from "./window.js";
import {
  UPDATER_NOTIFICATION_PROVIDER,
  UPDATER_TRAY_PROVIDER,
} from "./tokens.js";
import type {
  TTrayProvider,
  TUpdaterNotificationProvider,
} from "./types.js";

@RgModule({
  imports: [TrayModule, NotificationModule],
  ipc: [UpdaterIpc],
  windows: [UpdaterWindow],
  providers: [
    CheckForUpdateService,
    VerifyService,
    SetFeedUrlService,
    CreateLatestVersionFolderService,
    DownloadFileService,
    ControlUpdateService,
    SendUpdateInfoService,
    CheckUpdateProcessService,
    CheckForUpdatesService,
    OpenLatestVersionService,
    ControlUpdateWindowsPlatformService,
    {
      provide: UPDATER_TRAY_PROVIDER,
      useFactory: (trayService: TrayService): TTrayProvider => ({
        getMenu: () => trayService.getMenu(),
        collect: (items) => trayService.collect(items),
        destroy: () => trayService.destroy(),
      }),
      inject: [TrayService],
    },
    {
      provide: UPDATER_NOTIFICATION_PROVIDER,
      useFactory: (
        notificationService: NotificationService,
      ): TUpdaterNotificationProvider => ({
        initNotification: () => notificationService.initNotification(),
        setNotification: (options) =>
          notificationService.setNotification(options),
      }),
      inject: [NotificationService],
    },
  ],
  exports: [
    CheckForUpdatesService,
    ControlUpdateWindowsPlatformService,
    SetFeedUrlService,
    OpenLatestVersionService,
  ],
})
export class UpdaterModule {}
