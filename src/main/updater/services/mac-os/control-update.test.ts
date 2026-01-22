import { describe, expect, it, vi } from "vitest";

vi.mock("#shared/store.js", () => ({
  setStore: vi.fn(),
}));

describe("ControlUpdateService (macOS)", () => {
  it("dispatches update events and notifications", async () => {
    const { setStore } = await import("#shared/store.js");
    const { ControlUpdateService } = await import("./control-update.js");

    const checkForUpdateService = {
      checkForUpdate: vi.fn(({ eventCallBack }) => {
        eventCallBack({ status: "checking-for-update" });
        eventCallBack({ status: "update-not-available" });
        eventCallBack({ status: "update-available", version: "1.1.0" });
        eventCallBack({ status: "download-progress", downloadedPercent: "50" });
        eventCallBack({
          status: "update-downloaded",
          version: "1.1.0",
          updateFile: "app.dmg",
        });
      }),
    } as any;

    const sendUpdateInfoService = {
      sendUpdateInfo: vi.fn(),
    } as any;

    const notificationProvider = {
      setNotification: vi.fn(() => ({ show: vi.fn() })),
    } as any;

    const service = new ControlUpdateService(
      checkForUpdateService,
      sendUpdateInfoService,
      notificationProvider,
    );

    service.controlUpdate();

    expect(setStore).toHaveBeenCalledWith("updateProcess", true);
    expect(setStore).toHaveBeenCalledWith("updateProcess", false);
    expect(sendUpdateInfoService.sendUpdateInfo).toHaveBeenCalled();
    expect(notificationProvider.setNotification).toHaveBeenCalled();
  });
});
