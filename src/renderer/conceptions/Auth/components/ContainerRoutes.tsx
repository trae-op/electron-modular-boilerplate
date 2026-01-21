import { type ReactNode, memo, useEffect } from "react";

import { Provider } from "../context";
import { useSetAuthenticatedDispatch } from "../context/useSelectors";

const ContainerIpc = memo(({ children }: { children: ReactNode }) => {
  const setAuthenticated = useSetAuthenticatedDispatch();

  useEffect(() => {
    window.electron.send({
      type: "checkAuth",
    });
  }, []);

  useEffect(() => {
    window.electron.receive(({ type, data }) => {
      if (type !== "auth") {
        return;
      }

      if (!("isAuthenticated" in data)) {
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
