import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { TRoutes } from "../types";
import type { THookControl } from "./types";

export const useControl = (): THookControl => {
  const location = useLocation();
  const isMainRoute = useCallback(
    (routers: TRoutes[]) => {
      const pathname = location.pathname.substring(1);
      return routers.includes(pathname as TRoutes);
    },
    [location.pathname],
  );

  return {
    isMainRoute,
  };
};
