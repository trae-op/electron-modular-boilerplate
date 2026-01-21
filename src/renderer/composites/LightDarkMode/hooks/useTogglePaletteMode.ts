import { useCallback } from "react";

import { useLightDarkModeContext } from "../context";

export const useTogglePaletteMode = () => {
  const { getMode, setMode } = useLightDarkModeContext();

  return useCallback(() => {
    setMode(getMode() === "dark" ? "light" : "dark");
  }, [getMode, setMode]);
};
