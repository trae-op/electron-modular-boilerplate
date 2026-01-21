import { useContext } from "react";

import { Context } from "./Context";

export const useLightDarkModeContext = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("LightDarkMode context must be used within Provider");
  }

  return context;
};
