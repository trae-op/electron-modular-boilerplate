import { memo } from "react";

import { useControl } from "../hooks";
import { TPropsContainer } from "./types";

export const Container = memo(({ children, routes }: TPropsContainer) => {
  const { isMainRoute } = useControl();
  if (!isMainRoute(routes)) {
    return null;
  }

  return children;
});
