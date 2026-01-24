import { describe, expect, it, vi } from "vitest";

vi.mock("electron", () => ({
  session: {
    fromPartition: vi.fn().mockReturnValue({
      clearStorageData: vi.fn().mockResolvedValue(undefined),
    }),
  },
}));

vi.mock("#shared/store.js", () => ({
  deleteFromElectronStorage: vi.fn(),
  deleteStore: vi.fn(),
}));

vi.mock("#shared/ipc/ipc.js", () => ({
  ipcWebContentsSend: vi.fn(),
}));

describe("AuthService", () => {
  it("clears auth data and notifies renderer", async () => {
    const { AuthService } = await import("./service.js");
    const { deleteFromElectronStorage, deleteStore } =
      await import("#shared/store.js");
    const { ipcWebContentsSend } = await import("#shared/ipc/ipc.js");

    const service = new AuthService();

    const window = { webContents: {} } as any;
    service.logout(window);

    expect(deleteFromElectronStorage).toHaveBeenCalledWith("authToken");
    expect(deleteFromElectronStorage).toHaveBeenCalledWith("response");
    expect(deleteFromElectronStorage).toHaveBeenCalledWith("userId");
    expect(deleteStore).toHaveBeenCalledWith("masterKey");
    expect(ipcWebContentsSend).toHaveBeenCalledWith(
      "auth",
      window.webContents,
      {
        isAuthenticated: false,
      },
    );
  });
});
