import { type ButtonHTMLAttributes, type ReactNode } from "react";

export type TPropsButtonProvider = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  text: string;
};

export type TPropsLogoutButton = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children?: ReactNode;
};

export type TPropsProvider = {
  children: ReactNode;
};

export type TPropsPrivateRoute = {
  children: ReactNode;
};
