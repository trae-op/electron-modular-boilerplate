import isEqual from "lodash.isequal";
import { memo } from "react";

import { cn } from "@utils/classes";

import { TPropsLoadingSpinner } from "./types";

function arePropsEqual(
  oldProps: TPropsLoadingSpinner,
  newProps: TPropsLoadingSpinner,
): boolean {
  return (
    isEqual(oldProps.containerProps, newProps.containerProps) &&
    oldProps.spinnerClassName === newProps.spinnerClassName
  );
}

export const LoadingSpinner = memo(
  ({ containerProps, spinnerClassName }: TPropsLoadingSpinner) => {
    const { className = "", ...restContainerProps } = containerProps ?? {};

    const containerClassName = cn(
      "z-50 fixed inset-0 flex justify-center items-center bg-black/50",
      className,
    );

    const spinnerClasses = cn(
      "border-4 border-white/40 border-t-transparent rounded-full w-14 h-14 animate-spin",
      spinnerClassName,
    );

    return (
      <div
        data-testid="loading-spinner-container"
        className={containerClassName}
        {...restContainerProps}
      >
        <span
          aria-label="loading"
          role="status"
          data-testid="loading-spinner-progress"
          className={spinnerClasses}
        />
      </div>
    );
  },
  arePropsEqual,
);
