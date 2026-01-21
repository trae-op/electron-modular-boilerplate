import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LoadingSpinner } from "./LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders container and progress with default props", () => {
    render(<LoadingSpinner />);

    expect(screen.getByTestId("loading-spinner-container")).toBeInTheDocument();
    expect(screen.getByTestId("loading-spinner-progress")).toBeInTheDocument();
  });
});
