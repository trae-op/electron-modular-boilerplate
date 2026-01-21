import { useCallback, useEffect } from "react";

import {
  useSetDownloadedPercentDispatch,
  useSetMessageDispatch,
  useSetPlatformDispatch,
  useSetStatusDispatch,
  useSetUpdateFileDispatch,
  useSetVersionDispatch,
} from "../context/useSelectors";

export const UpdateSubscriber = () => {
  const setDownloadedPercent = useSetDownloadedPercentDispatch();
  const setMessage = useSetMessageDispatch();
  const setVersion = useSetVersionDispatch();
  const setPlatform = useSetPlatformDispatch();
  const setUpdateFile = useSetUpdateFileDispatch();
  const setStatus = useSetStatusDispatch();

  const subscribeUpdateApp = useCallback(() => {
    return window.electron.receive((payload) => {
      if (
        payload.type !== "updateApp" ||
        typeof payload.data !== "object" ||
        payload.data === null
      ) {
        return;
      }

      const data = payload.data as TUpdateData;

      const {
        downloadedPercent,
        message,
        version,
        platform,
        updateFile,
        status,
      } = data;

      setDownloadedPercent(downloadedPercent);
      setMessage(message);
      setVersion(version);
      setPlatform(platform);
      setUpdateFile(updateFile);
      setStatus(status);
    });
  }, []);

  useEffect(() => {
    window.electron.send({
      type: "checkForUpdates",
    });
  }, []);

  useEffect(() => {
    const unSub = subscribeUpdateApp();

    return unSub;
  }, []);

  return null;
};
