import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Card } from "./Card";

describe("Card component", () => {
  it("renders root container and optional slots when provided", () => {
    render(
      <Card
        componentPicture={<div>PictureContent</div>}
        componentContent={<div>BodyContent</div>}
        componentActions={<button>Action</button>}
      />,
    );

    const root = screen.getByTestId("card");
    expect(root).toBeInTheDocument();

    const picture = screen.getByTestId("card-picture");
    expect(picture).toHaveTextContent("PictureContent");

    const content = screen.getByTestId("card-content");
    expect(content).toHaveTextContent("BodyContent");

    const actions = screen.getByTestId("card-actions");
    expect(actions).toHaveTextContent("Action");
  });

  it("does not render optional slots when not provided", () => {
    render(<Card />);

    const root = screen.getByTestId("card");
    expect(root).toBeInTheDocument();

    expect(screen.queryByTestId("card-picture")).toBeNull();
    expect(screen.queryByTestId("card-content")).toBeNull();
    expect(screen.queryByTestId("card-actions")).toBeNull();
  });

  it("applies provided className to the root element", () => {
    render(<Card className="my-custom-class" />);

    const root = screen.getByTestId("card");
    expect(root.className).toContain("my-custom-class");
  });
});
