import { describe, expect, it } from "vitest";

import { isDev, isPlatform } from "./utils.js";

describe("@shared/utils", () => {
  describe("isDev", () => {
    it("returns true when NODE_ENV is development", () => {
      process.env.NODE_ENV = "development";
      expect(isDev()).toBe(true);
    });

    it("returns false when NODE_ENV is not development", () => {
      process.env.NODE_ENV = "production";
      expect(isDev()).toBe(false);
    });
  });

  describe("isPlatform", () => {
    it("returns true for current platform", () => {
      expect(isPlatform(process.platform)).toBe(true);
    });

    it("returns false for different platform", () => {
      const otherPlatform = process.platform === "win32" ? "darwin" : "win32";
      expect(isPlatform(otherPlatform)).toBe(false);
    });
  });
});
