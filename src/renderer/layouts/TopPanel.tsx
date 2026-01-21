import { type HTMLAttributes, type ReactNode } from "react";

type TProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export const TopPanel = ({ children, className = "", ...other }: TProps) => {
  const classes = ["flex items-center gap-2", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...other}>
      {children}
    </div>
  );
};
