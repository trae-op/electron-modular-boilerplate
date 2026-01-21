import type { TCache } from "./types.js";

export const cacheWindows = new Map<keyof TCache, TCache[keyof TCache]>();
