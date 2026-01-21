import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RadioGroup } from "./RadioGroup";

describe("RadioGroup", () => {
  const baseItems = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  it("checks the radio matching default value", () => {
    render(
      <RadioGroup items={baseItems} defaultValue="b" dataTestId="radio" />,
    );

    expect(screen.getByTestId("radio-b")).toBeChecked();
    expect(screen.getByTestId("radio-a")).not.toBeChecked();
  });

  it("calls onChange when selection changes", () => {
    const handleChange = vi.fn();

    render(
      <RadioGroup
        items={baseItems}
        dataTestId="radio"
        onChange={handleChange}
      />,
    );

    fireEvent.click(screen.getByLabelText("Option B"));
    expect(handleChange).toHaveBeenCalled();
  });

  it("displays error text when invalid", () => {
    render(
      <RadioGroup
        items={baseItems}
        dataTestId="radio"
        isError
        textError="Pick one"
      />,
    );

    expect(screen.getByText("Pick one")).toBeInTheDocument();
    expect(screen.getByTestId("radio-a")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
