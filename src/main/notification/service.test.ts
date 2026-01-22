import { describe, expect, it, vi } from "vitest";

vi.mock("#shared/path-resolver.js", () => ({
  getAssetsPath: vi.fn(() => "/assets"),
}));

const notificationInstance = {
  show: vi.fn(),
  title: "",
};

vi.mock("electron", () => ({
  Notification: vi.fn(() => notificationInstance),
}));

describe("NotificationService", () => {
  it("initializes notification with icon", async () => {
    const { Notification } = await import("electron");
    const { NotificationService } = await import("./service.js");

    const service = new NotificationService();
    service.initNotification();

    expect(Notification).toHaveBeenCalledWith(
      expect.objectContaining({ icon: "/assets/72x72.png" }),
    );
  });

  it("updates notification options", async () => {
    const { NotificationService } = await import("./service.js");
    const service = new NotificationService();
    service.initNotification();

    const updated = service.setNotification({ title: "Hi" });

    expect(updated).toBe(notificationInstance);
    expect(notificationInstance.title).toBe("Hi");
  });
});
