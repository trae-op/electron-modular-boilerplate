import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProviderLightDarkMode } from "..";
import { STORAGE_KEY_MODE } from "../constants";
import { useTogglePaletteMode } from "./useTogglePaletteMode";

const renderWithProvider = <TResult>(callback: () => TResult) => {
  return renderHook(callback, { wrapper: ProviderLightDarkMode });
};

const setupMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => {
      return {
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } as MediaQueryList;
    }),
  });
};

describe("useTogglePaletteMode", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.dataset.paletteMode = "";
    document.documentElement.style.colorScheme = "";
    setupMatchMedia(false);
  });

  it("switches from light to dark mode and stores the preference", async () => {
    window.localStorage.setItem(STORAGE_KEY_MODE, "light");

    const { result } = renderWithProvider(() => useTogglePaletteMode());

    await waitFor(() => {
      expect(document.documentElement.dataset.paletteMode).toBe("light");
    });

    act(() => {
      result.current();
    });

    await waitFor(() => {
      expect(document.documentElement.dataset.paletteMode).toBe("dark");
    });
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(window.localStorage.getItem(STORAGE_KEY_MODE)).toBe("dark");
  });

  it("switches from system dark preference to light mode", async () => {
    setupMatchMedia(true);

    const { result } = renderWithProvider(() => useTogglePaletteMode());

    await waitFor(() => {
      expect(document.documentElement.dataset.paletteMode).toBe("dark");
    });

    act(() => {
      result.current();
    });

    await waitFor(() => {
      expect(document.documentElement.dataset.paletteMode).toBe("light");
    });
    expect(window.localStorage.getItem(STORAGE_KEY_MODE)).toBe("light");
  });
});
