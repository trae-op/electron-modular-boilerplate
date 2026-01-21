import type {
  ButtonHTMLAttributes,
  ComponentType,
  PropsWithChildren,
} from "react";

export type TIconButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
> & {
  size?: number;
};

export type TAvatarButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  avatarClassName?: string;
  avatarSize?: number;
  email?: string;
  hasNotification?: boolean;
  name?: string;
  size?: number;
  src?: string;
  alt?: string;

  // Optional IconButton component to render the button frame
  iconButton?: ComponentType<TIconButtonProps>;
};
