import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders label and error text when invalid", () => {
    render(
      <Checkbox
        label="Accept terms"
        textError="Required"
        isError
        dataTestId="checkbox"
      />,
    );

    const checkbox = screen.getByTestId("checkbox");
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(checkbox).toHaveClass("border-red-500");
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("calls onChange handler when toggled", () => {
    const handleChange = vi.fn();

    render(
      <Checkbox
        label="Subscribe"
        onChange={handleChange}
        dataTestId="checkbox"
      />,
    );

    fireEvent.click(screen.getByTestId("checkbox"));
    expect(handleChange).toHaveBeenCalled();
  });
});
