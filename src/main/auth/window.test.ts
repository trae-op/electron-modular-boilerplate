import type { BrowserWindow } from "electron";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

import type { TLessProviders } from "./types.js";

let fromPartitionMock: Mock;
let createWindowMock: Mock;

vi.mock("electron", () => {
  fromPartitionMock = vi.fn();

  return {
    BrowserWindow: vi.fn(),
    session: {
      fromPartition: fromPartitionMock,
    },
  };
});

const restApiMock = {
  urls: {
    base: "https://example.com",
    baseApi: "/api",
    auth: {
      base: "/auth/",
      google: "google",
    },
  },
};

vi.mock("../config.js", () => ({ restApi: restApiMock }));

vi.mock("../@shared/control-window/create.js", () => {
  createWindowMock = vi.fn();
  return { createWindow: createWindowMock };
});

describe("openWindow", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("creates an auth window using the dedicated session", async () => {
    const { openWindow } = await import("./window.js");

    const authSession = { partition: "persist:auth" };
    const browserWindowStub = { id: "auth-window" } as unknown as BrowserWindow;

    fromPartitionMock.mockReturnValue(authSession);
    createWindowMock.mockReturnValue(browserWindowStub);

    const result = openWindow("google" as keyof TLessProviders);

    expect(fromPartitionMock).toHaveBeenCalledWith("persist:auth");
    expect(createWindowMock).toHaveBeenCalledTimes(1);

    const args = createWindowMock.mock.calls[0]?.[0];
    expect(args).toMatchObject({
      hash: "window:auth",
      loadURL: "https://example.com/api/auth/google",
    });

    expect(args.options).toMatchObject({
      autoHideMenuBar: true,
      minimizable: false,
      maximizable: false,
      title: "",
      width: 400,
      height: 400,
    });

    expect(args.options?.webPreferences?.session).toBe(authSession);
    expect(result).toBe(browserWindowStub);
  });
});
