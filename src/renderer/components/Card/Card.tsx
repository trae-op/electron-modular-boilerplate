import { cn } from "@utils/classes";
import { memo } from "react";

import type { TCardProps } from "./types";

const baseCardClassName =
  "flex w-full flex-col gap-4 bg-white dark:bg-gray-900 shadow-sm p-6 border border-gray-200 dark:border-gray-700 rounded-xl";

export const Card = memo((props: TCardProps) => {
  const {
    className = "",
    componentPicture,
    componentContent,
    componentActions,
  } = props;

  return (
    <div className={cn(baseCardClassName, className)} data-testid="card">
      {componentPicture ? (
        <div className="space-y-4 w-full" data-testid="card-picture">
          {componentPicture}
        </div>
      ) : null}

      {componentContent ? (
        <div className="space-y-2 w-full" data-testid="card-content">
          {componentContent}
        </div>
      ) : null}

      {componentActions ? (
        <div
          className="flex flex-wrap justify-end gap-2 pt-3 border-gray-100 dark:border-gray-800 border-t w-full"
          data-testid="card-actions"
        >
          {componentActions}
        </div>
      ) : null}
    </div>
  );
});

Card.displayName = "Card";
