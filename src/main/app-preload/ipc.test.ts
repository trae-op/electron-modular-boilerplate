import { describe, expect, it, vi } from "vitest";

vi.mock("@devisfuture/electron-modular", () => ({
  IpcHandler: () => () => undefined,
}));

describe("AppPreloadIpc", () => {
  it("creates preload window on init", async () => {
    const { AppPreloadIpc } = await import("./ipc.js");

    const create = vi.fn();
    const getWindow = vi.fn().mockReturnValue({ create });

    const ipc = new AppPreloadIpc();
    ipc.onInit({ getWindow } as any);

    expect(getWindow).toHaveBeenCalledWith("window:preload-app");
    expect(create).toHaveBeenCalled();
  });
});
