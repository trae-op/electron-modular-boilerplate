import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Select } from "./Select";

describe("Select", () => {
  const items = [
    { value: "1", label: "One" },
    { value: "2", label: "Two" },
  ];

  it("renders label, helper text, and options", () => {
    render(
      <Select
        items={items}
        label="Choose"
        helperText="Select one option"
        dataTestId="select"
      />,
    );

    expect(screen.getByText("Choose")).toBeInTheDocument();
    expect(screen.getByText("Select one option")).toBeInTheDocument();
    expect(screen.getByTestId("select")).toHaveDisplayValue("One");
  });

  it("shows error text when invalid", () => {
    render(
      <Select
        items={items}
        label="Choose"
        isError
        textError="Required"
        dataTestId="select"
      />,
    );

    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(screen.getByTestId("select")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
