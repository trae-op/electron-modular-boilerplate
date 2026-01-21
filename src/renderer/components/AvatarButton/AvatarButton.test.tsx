import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AvatarButton } from "./AvatarButton";

describe("AvatarButton", () => {
  it("renders avatar inside icon button with given size", () => {
    render(
      <AvatarButton
        name="John Doe"
        size={64}
        data-testid="avatar-button"
        avatarClassName="custom-avatar-class"
      />,
    );

    const button = screen.getByTestId("avatar-button");
    expect(button).toHaveStyle({ width: "64px", height: "64px" });
    expect(button).toHaveClass("rounded-full");
  });

  it("renders notification indicators when enabled", () => {
    render(
      <AvatarButton name="Jane" hasNotification data-testid="avatar-button" />,
    );

    const dots = screen.getAllByTestId("avatar-button-notification-dot");
    expect(dots).toHaveLength(2);
  });
});
