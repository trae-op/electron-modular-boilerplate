import { BrowserWindow } from "electron";

import { cacheWindows } from "./cache.js";

export function getWindow<N extends string>(
  name: N,
): BrowserWindow | undefined {
  const win = name ? cacheWindows.get(name) : undefined;

  return win !== undefined && typeof win !== "boolean" && !win.isDestroyed()
    ? win
    : undefined;
}
