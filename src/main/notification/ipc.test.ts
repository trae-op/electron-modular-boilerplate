import { describe, expect, it, vi } from "vitest";

vi.mock("@devisfuture/electron-modular", () => ({
  IpcHandler: () => () => undefined,
}));

describe("NotificationIpc", () => {
  it("initializes notification on init", async () => {
    const { NotificationIpc } = await import("./ipc.js");

    const notificationService = {
      initNotification: vi.fn(),
    } as any;

    const ipc = new NotificationIpc(notificationService);
    ipc.onInit();

    expect(notificationService.initNotification).toHaveBeenCalled();
  });
});
