import { describe, expect, it, vi } from "vitest";

vi.mock("@devisfuture/electron-modular", () => ({
  Injectable: () => () => undefined,
  getWindow: vi.fn(),
}));

vi.mock("#shared/ipc/ipc.js", () => ({
  ipcWebContentsSend: vi.fn(),
}));

describe("SendUpdateInfoService", () => {
  it("sends update payload to available windows", async () => {
    const { getWindow } = await import("@devisfuture/electron-modular");
    const { ipcWebContentsSend } = await import("#shared/ipc/ipc.js");
    const { SendUpdateInfoService } = await import("./send-update-info.js");

    const updateWindow = { webContents: {} } as any;
    const mainWindow = { webContents: {} } as any;

    vi.mocked(getWindow)
      .mockReturnValueOnce(updateWindow)
      .mockReturnValueOnce(mainWindow);

    const service = new SendUpdateInfoService();
    const payload = { status: "checking-for-update" } as any;

    service.sendUpdateInfo(payload);

    expect(ipcWebContentsSend).toHaveBeenCalledWith(
      "updateApp",
      updateWindow.webContents,
      payload,
    );
    expect(ipcWebContentsSend).toHaveBeenCalledWith(
      "updateApp",
      mainWindow.webContents,
      payload,
    );
  });
});
