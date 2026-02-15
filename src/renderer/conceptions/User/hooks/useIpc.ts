import { useCallback, useEffect } from "react";

import { useSetUserDispatch } from "../context/useSelectors";

export const useIpc = () => {
  const setUser = useSetUserDispatch();

  const initUserModule = useCallback(async (successfulCallback: () => void) => {
    const data = await window.electron.invoke("init-user-lazy");
    const { initialized, error } = data;

    if (initialized && error === undefined) {
      successfulCallback();
    }
  }, []);

  useEffect(() => {
    initUserModule(() => {
      window.electron.send("user");
    });
  }, [initUserModule]);

  useEffect(() => {
    const unSub = window.electron.receive("user", (data) => {
      if (data === undefined) {
        return;
      }

      setUser(data.user);
    });

    return unSub;
  }, []);
};
