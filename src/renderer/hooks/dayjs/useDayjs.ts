import { useEffect, useState } from "react";

import { TDayjs } from "./types";

let cachedDayjs: TDayjs = undefined;

export function useDayjs() {
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    if (cachedDayjs === undefined) {
      import("dayjs").then((mod) => {
        const instance = mod.default || mod;
        cachedDayjs = instance;
        setLoaded(true);
      });
    }
  }, []);

  if (isLoaded) {
    return cachedDayjs;
  }

  return undefined;
}
