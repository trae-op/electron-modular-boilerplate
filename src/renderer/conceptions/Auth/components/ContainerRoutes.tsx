import { type ReactNode, memo, useEffect } from "react";

import { Provider } from "../context";
import { useSetAuthenticatedDispatch } from "../context/useSelectors";

const ContainerIpc = memo(({ children }: { children: ReactNode }) => {
  const setAuthenticated = useSetAuthenticatedDispatch();

  useEffect(() => {
    window.electron.send("checkAuth");
  }, []);

  useEffect(() => {
    window.electron.receive("auth", (data) => {
      if (data === undefined) {
        return;
      }

      setAuthenticated(data.isAuthenticated);
    });
  }, []);

  return children;
});

export const ProviderAuth = memo(({ children }: { children: ReactNode }) => (
  <Provider>
    <ContainerIpc>{children}</ContainerIpc>
  </Provider>
));
