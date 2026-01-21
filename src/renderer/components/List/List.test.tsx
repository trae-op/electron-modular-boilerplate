import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { List } from "./List";

describe("List", () => {
  it("renders provided items", () => {
    render(
      <List
        data-testid="list"
        items={[
          { id: "1", content: <span data-testid="list-item-1">First</span> },
          { id: "2", content: <span data-testid="list-item-2">Second</span> },
        ]}
      />,
    );

    expect(screen.getByTestId("list")).toBeInTheDocument();
    expect(screen.getByTestId("list-item-1")).toHaveTextContent("First");
    expect(screen.getByTestId("list-item-2")).toHaveTextContent("Second");
  });

  it("supports rendering as a custom element", () => {
    render(
      <List
        as="ul"
        data-testid="list"
        items={[{ id: "1", content: <li data-testid="list-item">Item</li> }]}
      />,
    );

    expect(screen.getByTestId("list").tagName).toBe("UL");
  });
});
