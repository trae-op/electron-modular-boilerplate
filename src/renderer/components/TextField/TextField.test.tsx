import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TextField } from "./TextField";

describe("TextField", () => {
  it("renders label and helper text", () => {
    render(
      <TextField
        label="Email"
        helperText="We never share your email"
        dataTestId="text-field"
      />,
    );

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("We never share your email")).toBeInTheDocument();
    expect(screen.getByTestId("text-field")).toHaveAttribute("type", "text");
  });

  it("shows error message when invalid", () => {
    render(
      <TextField
        label="Email"
        isError
        textError="Invalid"
        dataTestId="text-field"
      />,
    );

    expect(screen.getByText("Invalid")).toBeInTheDocument();
    expect(screen.getByTestId("text-field")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
