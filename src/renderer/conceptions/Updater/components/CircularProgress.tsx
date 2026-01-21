import { useMemo } from "react";

import { useDownloadedPercentSelector } from "../context/useSelectors";

export const Circular = () => {
  const downloadedPercent = useDownloadedPercentSelector();
  const percent = useMemo(
    () =>
      downloadedPercent === undefined
        ? undefined
        : Math.round(Number(downloadedPercent)),
    [downloadedPercent],
  );

  if (percent === undefined) {
    return null;
  }

  return (
    <div className="space-y-2 w-64">
      <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-full h-3 overflow-hidden">
        <div
          className="bg-blue-500 h-full transition-[width] duration-200 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
        {percent}%
      </p>
    </div>
  );
};
