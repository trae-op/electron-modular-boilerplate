import { describe, expect, it, vi } from "vitest";

vi.mock("#shared/utils.js", () => ({
  isDev: vi.fn(() => false),
  isPlatform: vi.fn(() => false),
}));

vi.mock("electron-updater", () => ({
  default: {
    autoUpdater: {
      checkForUpdates: vi.fn(),
    },
  },
}));

describe("CheckForUpdatesService", () => {
  it("skips when update process is running", async () => {
    const { CheckForUpdatesService } = await import("./check-for-updates.js");

    const controlUpdateService = { controlUpdate: vi.fn() } as any;
    const checkUpdateProcessService = {
      isUpdateProcess: vi.fn(() => true),
    } as any;

    const service = new CheckForUpdatesService(
      controlUpdateService,
      checkUpdateProcessService,
    );

    service.checkForUpdates();

    expect(controlUpdateService.controlUpdate).not.toHaveBeenCalled();
  });

  it("uses autoUpdater on Windows", async () => {
    const { isPlatform } = await import("#shared/utils.js");
    vi.mocked(isPlatform).mockReturnValue(true);

    const updater = await import("electron-updater");
    const { CheckForUpdatesService } = await import("./check-for-updates.js");

    const controlUpdateService = { controlUpdate: vi.fn() } as any;
    const checkUpdateProcessService = {
      isUpdateProcess: vi.fn(() => false),
    } as any;

    const service = new CheckForUpdatesService(
      controlUpdateService,
      checkUpdateProcessService,
    );

    service.checkForUpdates();

    expect(updater.default.autoUpdater.checkForUpdates).toHaveBeenCalled();
  });

  it("uses mac control update on non-Windows", async () => {
    const { isPlatform } = await import("#shared/utils.js");
    vi.mocked(isPlatform).mockReturnValue(false);

    const { CheckForUpdatesService } = await import("./check-for-updates.js");

    const controlUpdateService = { controlUpdate: vi.fn() } as any;
    const checkUpdateProcessService = {
      isUpdateProcess: vi.fn(() => false),
    } as any;

    const service = new CheckForUpdatesService(
      controlUpdateService,
      checkUpdateProcessService,
    );

    service.checkForUpdates();

    expect(controlUpdateService.controlUpdate).toHaveBeenCalled();
  });
});
