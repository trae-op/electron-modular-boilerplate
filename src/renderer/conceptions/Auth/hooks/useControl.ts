import { useCallback, useMemo } from "react";

import type { TEventButton, THookControl } from "./types";

export const useControl = (): THookControl => {
  const handleProvider = useCallback((event: TEventButton) => {
    const provider = (event.target as HTMLButtonElement).dataset
      .provider as TProviders;
    window.electron.send("windowAuth", { provider });
  }, []);

  const handleLogout = useCallback(() => {
    window.electron.send("logout");
  }, []);

  const value = useMemo(
    () => ({
      handleLogout,
      handleProvider,
    }),
    [handleLogout, handleProvider],
  );

  return value;
};
