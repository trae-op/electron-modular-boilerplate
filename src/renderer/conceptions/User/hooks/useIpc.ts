import { useEffect } from "react";

import { useSetUserDispatch } from "../context/useSelectors";

export const useIpc = () => {
  const setUser = useSetUserDispatch();

  useEffect(() => {
    window.electron.send({
      type: "user",
    });
  }, []);

  useEffect(() => {
    const unSub = window.electron.receive(({ type, data }) => {
      if (type !== "user") {
        return;
      }

      setUser(data.user);
    });

    return unSub;
  }, []);
};
