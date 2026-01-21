import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { THookInvoke } from "./types";

export const useInvoke = (): THookInvoke => {
  const [version, setVersion] = useState("");
  const isSubscribe = useRef(true);

  const subscribe = useCallback(async () => {
    const value = await window.electron.invoke({
      type: "getVersion",
    });

    setVersion((prevValue) => (prevValue === value ? prevValue : value));
  }, []);

  useEffect(() => {
    if (isSubscribe.current) {
      isSubscribe.current = false;
      subscribe();
    }
  }, [subscribe]);

  return useMemo(() => ({ version }), [version]);
};
