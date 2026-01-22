import { describe, expect, it, vi } from "vitest";

vi.mock("@devisfuture/electron-modular", () => ({
  WindowManager: () => () => undefined,
  getWindow: vi.fn(),
}));

vi.mock("#shared/error-messages.js", () => ({
  showErrorMessages: vi.fn(),
}));

vi.mock("#shared/ipc/ipc.js", () => ({
  ipcWebContentsSend: vi.fn(),
}));

vi.mock("#shared/store.js", () => ({
  setElectronStorage: vi.fn(),
}));

describe("AuthWindow", () => {
  it("handles user already exists redirect", async () => {
    const { showErrorMessages } = await import("#shared/error-messages.js");
    const { AuthWindow } = await import("./window.js");

    const window = {
      close: vi.fn(),
    } as any;

    const authWindow = new AuthWindow();
    authWindow.onWebContentsDidFinishLoad(window);

    const url =
      "https://example.com/api/auth/user-exists?message=Already%20exists&email=test%40example.com";

    authWindow.onWebContentsWillRedirect({} as any, url);

    expect(window.close).toHaveBeenCalled();
    expect(showErrorMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "User already exists!",
        body: expect.stringContaining("Email: test@example.com"),
      }),
    );
  });

  it("handles verify redirect and stores auth data", async () => {
    const { ipcWebContentsSend } = await import("#shared/ipc/ipc.js");
    const { setElectronStorage } = await import("#shared/store.js");
    const { getWindow } = await import("@devisfuture/electron-modular");
    const { AuthWindow } = await import("./window.js");

    const mainWindow = { webContents: {} } as any;
    vi.mocked(getWindow).mockReturnValue(mainWindow);

    const window = { close: vi.fn() } as any;
    const authWindow = new AuthWindow();
    authWindow.onWebContentsDidFinishLoad(window);

    const url = "https://example.com/api/auth/verify?token=abc&userId=123";

    authWindow.onWebContentsWillRedirect({} as any, url);

    expect(window.close).toHaveBeenCalled();
    expect(ipcWebContentsSend).toHaveBeenCalledWith(
      "auth",
      mainWindow.webContents,
      { isAuthenticated: true },
    );
    expect(setElectronStorage).toHaveBeenCalledWith("authToken", "abc");
    expect(setElectronStorage).toHaveBeenCalledWith("userId", "123");
  });

  it("shows error when token or userId is missing", async () => {
    const { showErrorMessages } = await import("#shared/error-messages.js");
    const { AuthWindow } = await import("./window.js");

    const window = { close: vi.fn() } as any;
    const authWindow = new AuthWindow();
    authWindow.onWebContentsDidFinishLoad(window);

    const url = "https://example.com/api/auth/verify?token=&userId=";

    authWindow.onWebContentsWillRedirect({} as any, url);

    expect(showErrorMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Token or userId is missing!",
      }),
    );
  });
});
