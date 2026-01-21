import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { STORAGE_KEY_MODE } from "./constants";
import { ProviderLightDarkMode, Toggle } from "./index";

const renderWithProvider = (node: ReactNode) => {
  return render(<ProviderLightDarkMode>{node}</ProviderLightDarkMode>);
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

describe("LightDarkMode", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.dataset.paletteMode = "";
    document.documentElement.style.colorScheme = "";
    setupMatchMedia(false);
  });

  it("uses stored palette mode value on mount", async () => {
    window.localStorage.setItem(STORAGE_KEY_MODE, "dark");

    renderWithProvider(<Toggle />);

    await waitFor(() => {
      expect(document.documentElement.dataset.paletteMode).toBe("dark");
    });

    const button = screen.getByTestId("light-dark-mode:toggle");
    expect(button).toHaveAttribute("aria-label", "Enable light mode");
  });

  it("toggles palette mode and persists the selection", async () => {
    window.localStorage.setItem(STORAGE_KEY_MODE, "light");
    const user = userEvent.setup();

    renderWithProvider(<Toggle />);

    const button = screen.getByTestId("light-dark-mode:toggle");
    expect(button).toHaveAttribute("aria-label", "Enable dark mode");

    await user.click(button);

    await waitFor(() => {
      expect(document.documentElement.dataset.paletteMode).toBe("dark");
    });

    expect(window.localStorage.getItem(STORAGE_KEY_MODE)).toBe("dark");
    expect(button).toHaveAttribute("aria-label", "Enable light mode");
  });

  it("defaults to system preference when storage is empty", async () => {
    setupMatchMedia(true);

    renderWithProvider(<Toggle />);

    await waitFor(() => {
      expect(document.documentElement.dataset.paletteMode).toBe("dark");
    });
  });
});
