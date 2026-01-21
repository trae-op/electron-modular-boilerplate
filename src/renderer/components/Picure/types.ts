import type { ReactNode } from "react";

export type TPictureProps = {
  alt: string;
  src: string;
  onLoad?: () => void;
  onError?: () => void;
  classNameImage?: string;
  classNameContainer?: string;
  componentError?: ReactNode;
};
