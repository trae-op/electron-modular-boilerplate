import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Popover } from "./Popover";

describe("Popover", () => {
  const createAnchor = () => {
    const anchor = document.createElement("button");
    document.body.appendChild(anchor);

    Object.defineProperty(anchor, "getBoundingClientRect", {
      value: () => ({
        width: 40,
        height: 20,
        top: 10,
        left: 15,
        bottom: 30,
        right: 55,
        x: 15,
        y: 10,
        toJSON: () => ({}),
      }),
    });

    return anchor;
  };

  it("does not render when closed and not keepMounted", () => {
    const anchor = createAnchor();

    const { unmount } = render(
      <Popover
        anchorEl={anchor}
        open={false}
        onClose={() => undefined}
        data-testid="popover"
        disablePortal
      >
        Content
      </Popover>,
    );

    expect(screen.queryByTestId("popover")).toBeNull();
    unmount();
    document.body.removeChild(anchor);
  });

  it("renders content when open", () => {
    const anchor = createAnchor();

    render(
      <Popover
        anchorEl={anchor}
        open
        onClose={() => undefined}
        data-testid="popover"
        disablePortal
      >
        <span data-testid="popover-child">Child</span>
      </Popover>,
    );

    expect(screen.getByTestId("popover")).toBeInTheDocument();
    expect(screen.getByTestId("popover-child")).toHaveTextContent("Child");
    document.body.removeChild(anchor);
  });

  it("closes on outside click and Escape key", () => {
    const anchor = createAnchor();
    const handleClose = vi.fn();

    render(
      <Popover
        anchorEl={anchor}
        open
        onClose={handleClose}
        data-testid="popover"
        disablePortal
      >
        Content
      </Popover>,
    );

    fireEvent.mouseDown(document.body);
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(2);
    document.body.removeChild(anchor);
  });
});
