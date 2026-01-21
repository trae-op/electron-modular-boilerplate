import { type HTMLAttributes, memo } from "react";

import { cn } from "@utils/classes";

import { useMessageSelector } from "../context/useSelectors";

type Props = HTMLAttributes<HTMLParagraphElement>;

export const Message = memo(({ className = "", ...props }: Props) => {
  const message = useMessageSelector();

  if (message === undefined) {
    return null;
  }

  const textClassName = cn(
    "text-gray-600 dark:text-gray-300 text-base",
    className,
  );

  return (
    <p className={textClassName} {...props}>
      {message}
    </p>
  );
});
