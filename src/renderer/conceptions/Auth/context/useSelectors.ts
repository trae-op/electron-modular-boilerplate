import { useSyncExternalStore } from "react";

import { useEntityContext } from "./useContext";

export function useAuthenticatedSelector(): boolean | undefined {
  const { hasAuthenticated, subscribe } = useEntityContext();
  return useSyncExternalStore(subscribe, hasAuthenticated, hasAuthenticated);
}

export const useSetAuthenticatedDispatch = () => {
  return useEntityContext().setAuthenticated;
};
