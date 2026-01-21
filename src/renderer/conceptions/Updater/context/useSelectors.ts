import { useSyncExternalStore } from "react";

import { useEntityContext } from "./useContext";

export function useDownloadedPercentSelector():
  | TUpdateData["downloadedPercent"]
  | undefined {
  const { getDownloadedPercent, subscribe } = useEntityContext();
  return useSyncExternalStore(
    subscribe,
    getDownloadedPercent,
    getDownloadedPercent,
  );
}

export const useSetDownloadedPercentDispatch = () => {
  return useEntityContext().setDownloadedPercent;
};

export function useMessageSelector(): TUpdateData["message"] | undefined {
  const { getMessage, subscribe } = useEntityContext();
  return useSyncExternalStore(subscribe, getMessage, getMessage);
}

export const useSetMessageDispatch = () => {
  return useEntityContext().setMessage;
};

export function useVersionSelector(): TUpdateData["version"] | undefined {
  const { getVersion, subscribe } = useEntityContext();
  return useSyncExternalStore(subscribe, getVersion, getVersion);
}

export const useSetVersionDispatch = () => {
  return useEntityContext().setVersion;
};

export function usePlatformSelector(): TUpdateData["platform"] | undefined {
  const { getPlatform, subscribe } = useEntityContext();
  return useSyncExternalStore(subscribe, getPlatform, getPlatform);
}

export const useSetPlatformDispatch = () => {
  return useEntityContext().setPlatform;
};

export function useUpdateFileSelector(): TUpdateData["updateFile"] | undefined {
  const { getUpdateFile, subscribe } = useEntityContext();
  return useSyncExternalStore(subscribe, getUpdateFile, getUpdateFile);
}

export const useSetUpdateFileDispatch = () => {
  return useEntityContext().setUpdateFile;
};

export function useStatusSelector(): TUpdateData["status"] {
  const { getStatus, subscribe } = useEntityContext();
  return useSyncExternalStore(subscribe, getStatus, getStatus);
}

export const useSetStatusDispatch = () => {
  return useEntityContext().setStatus;
};
