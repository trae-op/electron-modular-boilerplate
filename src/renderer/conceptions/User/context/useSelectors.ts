import { useSyncExternalStore } from "react";

import { useEntityContext } from "./useContext";

export function useUserSelector(): TUser | undefined {
  const { getUser, subscribe } = useEntityContext();
  return useSyncExternalStore(subscribe, getUser, getUser);
}

export const useSetUserDispatch = () => {
  return useEntityContext().setUser;
};
