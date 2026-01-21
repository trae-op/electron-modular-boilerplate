import { BrowserWindow } from "electron";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { destroyWindows } from "./destroy.js";

const mockDestroy = vi.fn();
const mockIsDestroyed = vi.fn();

vi.mock("electron", () => ({
  BrowserWindow: {
    getAllWindows: vi.fn(),
  },
}));

const mockedBrowserWindow = BrowserWindow as unknown as {
  getAllWindows: ReturnType<typeof vi.fn>;
};

describe("destroyWindows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does nothing when there are no windows", () => {
    mockedBrowserWindow.getAllWindows = vi.fn().mockReturnValue([]);

    destroyWindows();

    expect(mockedBrowserWindow.getAllWindows).toHaveBeenCalledTimes(1);
    expect(mockDestroy).not.toHaveBeenCalled();
  });

  it("destroys only windows that are not already destroyed", () => {
    const aliveWindow = {
      isDestroyed: mockIsDestroyed.mockReturnValueOnce(false),
      destroy: mockDestroy,
    } as unknown as BrowserWindow;

    const destroyedWindow = {
      isDestroyed: vi.fn().mockReturnValue(true),
      destroy: mockDestroy,
    } as unknown as BrowserWindow;

    mockedBrowserWindow.getAllWindows = vi
      .fn()
      .mockReturnValue([aliveWindow, destroyedWindow]);

    destroyWindows();

    expect(mockedBrowserWindow.getAllWindows).toHaveBeenCalledTimes(1);
    expect(mockIsDestroyed).toHaveBeenCalledTimes(1);
    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });
});
