import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

let Picture: (typeof import("./Picture"))["Picture"];

const originalImage = global.Image;

let mockImageRegistry: Record<string, MockImage> = {};

class MockImage {
  public onload: (() => void) | null = null;

  public onerror: (() => void) | null = null;

  public set src(value: string) {
    mockImageRegistry[value] = this;
  }
}

const triggerImageLoad = async (src: string) => {
  await waitFor(() => {
    expect(mockImageRegistry[src]).toBeDefined();
  });

  await act(async () => {
    mockImageRegistry[src].onload?.();
  });
};

const triggerImageError = async (src: string) => {
  await waitFor(() => {
    expect(mockImageRegistry[src]).toBeDefined();
  });

  await act(async () => {
    mockImageRegistry[src].onerror?.();
  });
};

describe("Picture", () => {
  beforeAll(() => {
    // @ts-expect-error override for testing environment
    global.Image = MockImage;
  });

  afterAll(() => {
    global.Image = originalImage;
  });

  beforeEach(async () => {
    vi.resetModules();
    mockImageRegistry = {};

    const module = await import("./Picture");
    Picture = module.Picture;
  });

  afterEach(() => {
    cleanup();
    mockImageRegistry = {};
  });

  it("shows loader until image loads and triggers onLoad callback", async () => {
    const src = "https://mui.com/static/images/cards/paella.jpg";
    const handleLoad = vi.fn();

    render(<Picture alt="Sample" src={src} onLoad={handleLoad} />);

    expect(screen.getByTestId("picture-loading")).toBeInTheDocument();

    await triggerImageLoad(src);

    await waitFor(() => {
      expect(screen.queryByTestId("picture-loading")).not.toBeInTheDocument();
    });

    expect(handleLoad).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("picture-image")).toBeInTheDocument();
  });

  it("renders custom error component and calls onError when loading fails", async () => {
    const src = "https://example.com/failure.jpg";
    const handleError = vi.fn();

    render(
      <Picture
        alt="Broken"
        src={src}
        onError={handleError}
        componentError={<div data-testid="picture-custom-error">Error</div>}
      />,
    );

    await triggerImageError(src);

    await waitFor(() => {
      expect(screen.getByTestId("picture-error")).toBeInTheDocument();
    });

    expect(handleError).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("picture-custom-error")).toBeInTheDocument();
    expect(screen.queryByTestId("picture-image")).not.toBeInTheDocument();
  });

  it("uses cached status to skip loader and duplicate onLoad calls", async () => {
    const src = "https://mui.com/static/images/cards/paella.jpg";
    const handleLoadFirst = vi.fn();
    const handleLoadSecond = vi.fn();

    const firstRender = render(
      <Picture alt="Cached" src={src} onLoad={handleLoadFirst} />,
    );

    await triggerImageLoad(src);

    await waitFor(() => {
      expect(handleLoadFirst).toHaveBeenCalledTimes(1);
    });

    firstRender.unmount();

    render(<Picture alt="Cached" src={src} onLoad={handleLoadSecond} />);

    expect(screen.queryByTestId("picture-loading")).not.toBeInTheDocument();
    expect(screen.getByTestId("picture-image")).toBeInTheDocument();
    expect(handleLoadSecond).not.toHaveBeenCalled();
  });
});
