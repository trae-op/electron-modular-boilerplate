import { describe, expect, it, vi } from "vitest";

vi.mock("@devisfuture/electron-modular", () => ({
  IpcHandler: () => () => undefined,
}));

vi.mock("#shared/ipc/ipc.js", () => ({
  ipcMainHandle: vi.fn(),
}));

vi.mock("electron", () => ({
  app: {
    getVersion: vi.fn(() => "1.2.3"),
  },
}));

describe("AppVersionIpc", () => {
  it("registers getVersion handler", async () => {
    const { ipcMainHandle } = await import("#shared/ipc/ipc.js");
    const { AppVersionIpc } = await import("./ipc.js");

    const ipc = new AppVersionIpc();
    ipc.onInit();

    expect(ipcMainHandle).toHaveBeenCalledWith(
      "getVersion",
      expect.any(Function),
    );

    const handler = vi.mocked(ipcMainHandle).mock.calls[0][1] as any;
    expect(await handler()).toBe("1.2.3");
  });
});
