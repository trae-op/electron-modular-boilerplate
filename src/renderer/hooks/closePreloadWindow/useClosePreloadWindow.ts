import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useClosePreloadWindow = (currentPathname: string) => {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalizedParam = currentPathname.startsWith("/")
      ? currentPathname
      : `/${currentPathname}`;

    if (normalizedParam === pathname) {
      window.electron.send({
        type: "windowClosePreload",
      });
    }
  }, [currentPathname, pathname]);
};
