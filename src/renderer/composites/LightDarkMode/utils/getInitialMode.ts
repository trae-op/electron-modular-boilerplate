import { STORAGE_KEY_MODE } from "../constants";
import type { TPaletteMode } from "../context/types";

const FALLBACK_MODE: TPaletteMode = "dark";
const isPaletteMode = (value: unknown): value is TPaletteMode => {
  return value === "light" || value === "dark";
};

export const getInitialMode = (): TPaletteMode => {
  if (typeof window === "undefined") {
    return FALLBACK_MODE;
  }

  const storedMode = window.localStorage.getItem(STORAGE_KEY_MODE);
  if (isPaletteMode(storedMode)) {
    return storedMode;
  }

  const prefersDark = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
    : false;

  return prefersDark ? "dark" : "light";
};
