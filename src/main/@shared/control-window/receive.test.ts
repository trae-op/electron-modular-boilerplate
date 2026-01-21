import { BrowserWindow } from "electron";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { cacheWindows } from "./cache.js";
import { getWindow } from "./receive.js";

vi.mock("electron", () => ({
  BrowserWindow: {
    // We only need the static typing here, instance methods are mocked per test
  },
}));

describe("getWindow", () => {
  beforeEach(() => {
    cacheWindows.clear();
  });

  it("returns undefined when no name is provided", () => {
    // @ts-expect-error testing runtime behaviour with missing name
    const win = getWindow();
    expect(win).toBeUndefined();
  });

  it("returns undefined when cache does not contain the window", () => {
    const win = getWindow("missing-window");
    expect(win).toBeUndefined();
  });

  it("returns undefined when cached value is boolean", () => {
    // @ts-expect-error intentionally violating type to verify runtime guard
    cacheWindows.set("flag", true);

    const win = getWindow("flag");
    expect(win).toBeUndefined();
  });

  it("returns undefined when window is destroyed", () => {
    const fakeWindow = {
      isDestroyed: vi.fn().mockReturnValue(true),
    } as unknown as BrowserWindow;

    cacheWindows.set("destroyed-window", fakeWindow);

    const win = getWindow("destroyed-window");
    expect(fakeWindow.isDestroyed).toHaveBeenCalledTimes(1);
    expect(win).toBeUndefined();
  });

  it("returns the window when it exists and is not destroyed", () => {
    const fakeWindow = {
      isDestroyed: vi.fn().mockReturnValue(false),
    } as unknown as BrowserWindow;

    cacheWindows.set("active-window", fakeWindow);

    const win = getWindow("active-window");
    expect(fakeWindow.isDestroyed).toHaveBeenCalledTimes(1);
    expect(win).toBe(fakeWindow);
  });
});
