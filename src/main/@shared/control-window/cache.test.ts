import { describe, expect, it } from "vitest";

import { cacheWindows } from "./cache.js";
import type { TCache } from "./types.js";

// Basic sanity tests for the shared window cache map

describe("cacheWindows", () => {
  it("is initialised as an empty Map", () => {
    expect(cacheWindows instanceof Map).toBe(true);
    expect(cacheWindows.size).toBe(0);
  });

  it("allows setting and getting windows by key", () => {
    const fakeWindow = {} as unknown as TCache[string];

    cacheWindows.set("test-window", fakeWindow);

    expect(cacheWindows.get("test-window")).toBe(fakeWindow);
  });
});
