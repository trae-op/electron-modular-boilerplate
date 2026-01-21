import { useSyncExternalStore } from "react";

import { useLightDarkModeContext } from "../context";
import type { TPaletteMode } from "../context/types";

export const usePaletteModeSelector = (): TPaletteMode => {
  const { subscribe, getMode } = useLightDarkModeContext();
  return useSyncExternalStore(subscribe, getMode, getMode);
};
