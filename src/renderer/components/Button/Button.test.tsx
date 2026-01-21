import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("applies contained primary styles by default", () => {
    render(<Button data-testid="button">Click me</Button>);

    const button = screen.getByTestId("button");
    expect(button).toHaveClass("bg-blue-600");
    expect(button).toHaveAttribute("type", "button");
  });

  it("allows overriding variant and color", () => {
    render(
      <Button variant="outlined" color="success" data-testid="button">
        Submit
      </Button>,
    );

    const button = screen.getByTestId("button");
    expect(button).toHaveClass("text-green-600");
    expect(button).toHaveClass("hover:bg-green-50");
  });

  it("merges custom className", () => {
    render(
      <Button className="custom-class" data-testid="button">
        Labeled
      </Button>,
    );

    expect(screen.getByTestId("button")).toHaveClass("custom-class");
  });
});
