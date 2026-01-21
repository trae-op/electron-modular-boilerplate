import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("applies sizing style when size prop is provided", () => {
    render(
      <IconButton size={32} data-testid="icon-button">
        <span data-testid="icon-button-child" />
      </IconButton>,
    );

    const button = screen.getByTestId("icon-button");
    expect(button).toHaveStyle({ width: "32px", height: "32px" });
  });

  it("merges custom className", () => {
    render(
      <IconButton className="custom" data-testid="icon-button">
        Icon
      </IconButton>,
    );

    expect(screen.getByTestId("icon-button")).toHaveClass("custom");
  });
});
