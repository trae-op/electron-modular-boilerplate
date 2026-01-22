import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("electron", () => ({
  app: {
    getPath: vi.fn(() => "/downloads"),
    getVersion: vi.fn(() => "1.0.0"),
  },
  dialog: {
    showMessageBox: vi.fn(),
  },
}));

vi.mock("compare-versions", () => ({
  compareVersions: vi.fn(),
}));

describe("CheckForUpdateService (macOS)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("emits update-not-available when latest version is not newer", async () => {
    const { compareVersions } = await import("compare-versions");
    vi.mocked(compareVersions).mockReturnValue(0);

    globalThis.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ tag_name: "v1.0.0" }),
    }) as any;

    const downloadFileService = { downloadFile: vi.fn() } as any;
    const verifyService = { isVerify: vi.fn() } as any;

    const { CheckForUpdateService } = await import("./check-for-update.js");
    const service = new CheckForUpdateService(
      downloadFileService,
      verifyService,
    );

    const eventCallBack = vi.fn();

    await service.checkForUpdate({ eventCallBack });

    expect(eventCallBack).toHaveBeenCalledWith(
      expect.objectContaining({ status: "update-not-available" }),
    );
  });

  it("emits update-downloaded when file already verified", async () => {
    const { compareVersions } = await import("compare-versions");
    vi.mocked(compareVersions).mockReturnValue(1);

    globalThis.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        tag_name: "v1.1.0",
        assets: [
          {
            name: "app.dmg",
            id: "asset-1",
            size: 100,
            browser_download_url: "http://example.com/app.dmg",
          },
        ],
      }),
    }) as any;

    const downloadFileService = { downloadFile: vi.fn() } as any;
    const verifyService = { isVerify: vi.fn().mockResolvedValue(true) } as any;

    const { CheckForUpdateService } = await import("./check-for-update.js");
    const service = new CheckForUpdateService(
      downloadFileService,
      verifyService,
    );

    const eventCallBack = vi.fn();

    await service.checkForUpdate({ eventCallBack });

    expect(eventCallBack).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "update-downloaded",
        version: "1.1.0",
      }),
    );
    expect(downloadFileService.downloadFile).not.toHaveBeenCalled();
  });

  it("shows dialog on errors", async () => {
    const { dialog } = await import("electron");

    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network")) as any;

    const downloadFileService = { downloadFile: vi.fn() } as any;
    const verifyService = { isVerify: vi.fn() } as any;

    const { CheckForUpdateService } = await import("./check-for-update.js");
    const service = new CheckForUpdateService(
      downloadFileService,
      verifyService,
    );

    const eventCallBack = vi.fn();

    await service.checkForUpdate({ eventCallBack });

    expect(eventCallBack).toHaveBeenCalledWith(
      expect.objectContaining({ status: "error" }),
    );
    expect(dialog.showMessageBox).toHaveBeenCalled();
  });
});
