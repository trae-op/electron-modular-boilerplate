import type { PropsWithChildren } from "react";

export type TProviderProps = PropsWithChildren;

export type TSubscriberCallback = () => void;

export type TContext = {
  getUser: () => TUser | undefined;
  setUser: (value: TUser | undefined) => void;
  subscribe: (callback: TSubscriberCallback) => () => void;
};
