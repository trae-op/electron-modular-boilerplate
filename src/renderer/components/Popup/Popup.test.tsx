import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Popup } from "./Popup";

describe("Popup", () => {
  it("does not render when closed", () => {
    render(
      <Popup open={false} onClose={() => undefined} data-testid="popup">
        Hidden content
      </Popup>,
    );

    expect(screen.queryByTestId("popup")).toBeNull();
  });

  it("renders overlay and closes on backdrop click", () => {
    const handleClose = vi.fn();

    render(
      <Popup open onClose={handleClose} data-testid="popup">
        Visible content
      </Popup>,
    );

    fireEvent.mouseDown(screen.getByTestId("popup"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape key when configured", () => {
    const handleClose = vi.fn();

    render(
      <Popup open onClose={handleClose} data-testid="popup">
        Visible content
      </Popup>,
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("respects closeOnBackdrop setting", () => {
    const handleClose = vi.fn();

    render(
      <Popup
        open
        onClose={handleClose}
        closeOnBackdrop={false}
        data-testid="popup"
      >
        Content
      </Popup>,
    );

    fireEvent.mouseDown(screen.getByTestId("popup"));
    expect(handleClose).not.toHaveBeenCalled();
  });
});
