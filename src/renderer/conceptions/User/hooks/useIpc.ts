import { useEffect } from "react";

import { useSetUserDispatch } from "../context/useSelectors";

export const useIpc = () => {
  const setUser = useSetUserDispatch();

  useEffect(() => {
    window.electron.send("user");
  }, []);

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
