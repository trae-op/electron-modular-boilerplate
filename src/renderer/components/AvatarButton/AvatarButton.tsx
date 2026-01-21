import { memo, useMemo } from "react";
import type { CSSProperties } from "react";
import type { ComponentType } from "react";

import { cn } from "@utils/classes";

import { Avatar } from "@components/Avatar";

import type { TAvatarButtonProps, TIconButtonProps } from "./types";

const baseButtonClassName =
  "relative inline-flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm transition-colors duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700";

const DefaultIconButton: ComponentType<TIconButtonProps> = (props) => {
  const { children, className = "", type, ...rest } = props as any;
  return (
    <button type={type} className={className} {...rest}>
      {children}
    </button>
  );
};

export const AvatarButton = memo((props: TAvatarButtonProps) => {
  const {
    alt,
    avatarClassName,
    avatarSize,
    className = "",
    email,
    hasNotification = false,
    name,
    size = 40,
    src,
    style,
    type = "button",
    iconButton,
    ...restProps
  } = props;

  const IconButtonComponent =
    (iconButton as ComponentType<TIconButtonProps>) ?? DefaultIconButton;

  const mergedClassName = useMemo(() => {
    return cn(baseButtonClassName, className);
  }, [className]);

  const mergedStyle = useMemo((): CSSProperties | undefined => {
    return {
      width: size,
      height: size,
      minWidth: size,
      minHeight: size,
      ...style,
    };
  }, [size, style]);

  const innerAvatarSize = avatarSize ?? size;

  return (
    <IconButtonComponent
      {...(restProps as TIconButtonProps)}
      type={type}
      size={size}
      style={mergedStyle}
      className={mergedClassName}
      aria-label={
        props["aria-label"] || alt || name || email || "Open avatar menu"
      }
    >
      <Avatar
        alt={alt}
        className={avatarClassName}
        email={email}
        name={name}
        size={innerAvatarSize}
        src={src}
      />
      {hasNotification ? (
        <>
          <span
            data-testid="avatar-button-notification-dot"
            className="top-0 left-0 absolute bg-red-500 rounded-full w-2 h-2"
          />
          <span
            data-testid="avatar-button-notification-dot"
            className="top-0 left-0 absolute bg-red-500 opacity-60 blur-[1px] rounded-full w-2 h-2"
          />
        </>
      ) : null}
    </IconButtonComponent>
  );
});

AvatarButton.displayName = "AvatarButton";
