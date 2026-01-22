import { cn } from "@utils/classes";
import { memo, useMemo } from "react";
import type { CSSProperties } from "react";

import type { TAvatarProps } from "./types";

const baseFallbackClassName =
  "inline-flex items-center justify-center rounded-full bg-gray-300 text-sm text-gray-700 font-semibold uppercase overflow-hidden dark:bg-gray-600 dark:text-gray-100";
const baseImageClassName = "rounded-full object-cover";

const getFallbackChar = (
  fallback: string | undefined,
  name: string | undefined,
  email: string | undefined,
): string => {
  if (fallback && fallback.trim().length > 0) {
    return fallback.trim().charAt(0).toUpperCase();
  }

  const source = name || email;
  if (source && source.trim().length > 0) {
    return source.trim().charAt(0).toUpperCase();
  }

  return "?";
};

export const Avatar = memo((props: TAvatarProps) => {
  const {
    alt,
    className = "",
    email,
    fallback,
    name,
    size = 40,
    src,
    "data-testid": dataTestId,
  } = props;

  const mergedFallbackClassName = useMemo(() => {
    return cn(baseFallbackClassName, className);
  }, [className]);

  const mergedImageClassName = useMemo(() => {
    return cn(baseImageClassName, className);
  }, [className]);

  const dimensionStyle = useMemo((): CSSProperties => {
    return {
      width: size,
      height: size,
      minWidth: size,
      minHeight: size,
    };
  }, [size]);

  const altText = alt || name || email || "avatar";
  const fallbackChar = getFallbackChar(fallback, name, email);

  if (src) {
    return (
      <img
        alt={altText}
        src={src}
        className={mergedImageClassName}
        style={dimensionStyle}
        data-testid={dataTestId}
      />
    );
  }

  return (
    <span
      className={mergedFallbackClassName}
      style={dimensionStyle}
      aria-label={altText}
      data-testid={dataTestId}
    >
      {fallbackChar}
    </span>
  );
});

Avatar.displayName = "Avatar";
