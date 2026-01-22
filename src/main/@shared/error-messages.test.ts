import { describe, expect, it, vi } from "vitest";

import { showErrorMessages } from "./error-messages.js";

vi.mock("electron", () => ({
  dialog: {
    showMessageBox: vi.fn(),
  },
}));

vi.mock("./logger.js", () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe("@shared/error-messages", () => {
  it("logs error and shows dialog by default", async () => {
    showErrorMessages({ title: "Oops", body: "Something failed" });

    const { dialog } = await import("electron");
    const { logger } = await import("./logger.js");

    expect(logger.error).toHaveBeenCalledWith("Oops", "Something failed");
    expect(dialog.showMessageBox).toHaveBeenCalledWith({
      title: "Oops",
      message: "Something failed",
    });
  });

  it("logs error without showing dialog when isDialog is false", async () => {
    showErrorMessages({ title: "Oops", body: "Hidden", isDialog: false });

    const { dialog } = await import("electron");
    const { logger } = await import("./logger.js");

    expect(logger.error).toHaveBeenCalledWith("Oops", "Hidden");
    expect(dialog.showMessageBox).not.toHaveBeenCalled();
  });
});
