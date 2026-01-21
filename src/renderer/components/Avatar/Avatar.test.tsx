import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("renders fallback initial using name when no src provided", () => {
    render(<Avatar name="John" data-testid="avatar" />);

    expect(screen.getByTestId("avatar")).toHaveTextContent("J");
  });

  it("prefers explicit fallback character when provided", () => {
    render(<Avatar fallback="x" data-testid="avatar" />);

    expect(screen.getByTestId("avatar")).toHaveTextContent("X");
  });

  it("renders image element when src exists", () => {
    render(
      <Avatar
        src="https://example.com/avatar.png"
        alt="Profile picture"
        data-testid="avatar"
      />,
    );

    const image = screen.getByTestId("avatar") as HTMLImageElement;
    expect(image.tagName).toBe("IMG");
    expect(image).toHaveAttribute("alt", "Profile picture");
  });
});
