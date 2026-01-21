import { ImageOff, Loader2 } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { cn } from "@utils/classes";

import type { TPictureProps } from "./types";

type TCacheStatus = "loaded" | "error";

const pictureCache = new Map<string, TCacheStatus>();

const baseContainerClassName = "relative w-full overflow-hidden aspect-[16/9]";

const baseImageClassName =
  "block h-full w-full object-cover object-center transition-opacity duration-200";

const baseOverlayClassName =
  "absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300";

const baseErrorClassName = "absolute inset-0 flex items-center justify-center";

const getInitialStatus = (src: string): "loading" | TCacheStatus => {
  if (!src) {
    return "error";
  }

  const cached = pictureCache.get(src);

  return cached ?? "loading";
};

export const Picture = memo((props: TPictureProps) => {
  const {
    alt,
    src,
    onLoad,
    onError,
    classNameImage,
    classNameContainer,
    componentError,
  } = props;

  const [status, setStatus] = useState<"loading" | TCacheStatus>(() => {
    return getInitialStatus(src);
  });

  useEffect(() => {
    setStatus(getInitialStatus(src));

    if (!src) {
      pictureCache.set(src, "error");
      return;
    }

    const cached = pictureCache.get(src);

    if (cached === "loaded" || cached === "error") {
      return;
    }

    let isActive = true;

    const image = new Image();

    image.onload = () => {
      if (!isActive) {
        return;
      }

      pictureCache.set(src, "loaded");
      setStatus("loaded");
      onLoad?.();
    };

    image.onerror = () => {
      if (!isActive) {
        return;
      }

      pictureCache.set(src, "error");
      setStatus("error");
      onError?.();
    };

    image.src = src;

    return () => {
      isActive = false;
    };
  }, [onError, onLoad, src]);

  const handleImgLoad = useCallback(() => {
    if (!src) {
      return;
    }

    if (pictureCache.get(src) === "loaded") {
      return;
    }

    pictureCache.set(src, "loaded");
    setStatus("loaded");
    onLoad?.();
  }, [onLoad, src]);

  const handleImgError = useCallback(() => {
    if (!src) {
      return;
    }

    if (pictureCache.get(src) === "error") {
      return;
    }

    pictureCache.set(src, "error");
    setStatus("error");
    onError?.();
  }, [onError, src]);

  const mergedContainerClassName = useMemo(() => {
    return cn(baseContainerClassName, classNameContainer);
  }, [classNameContainer]);

  const mergedImageClassName = useMemo(() => {
    const isVisible = status === "loaded";

    return cn(
      baseImageClassName,
      isVisible ? "opacity-100" : "opacity-0",
      classNameImage,
    );
  }, [classNameImage, status]);

  const shouldShowOverlay = status === "loading";
  const shouldShowError = status === "error";

  return (
    <div
      className={mergedContainerClassName}
      aria-label={alt}
      data-testid="picture-container"
    >
      {!shouldShowError ? (
        <img
          alt={alt}
          src={src}
          loading="lazy"
          className={mergedImageClassName}
          onLoad={handleImgLoad}
          onError={handleImgError}
          data-testid="picture-image"
        />
      ) : null}

      {shouldShowOverlay ? (
        <div className={baseOverlayClassName} data-testid="picture-loading">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : null}

      {shouldShowError ? (
        <div
          className={cn(baseOverlayClassName, baseErrorClassName)}
          data-testid="picture-error"
        >
          {componentError ?? (
            <ImageOff className="w-6 h-6" aria-label="image failed to load" />
          )}
        </div>
      ) : null}
    </div>
  );
});

Picture.displayName = "Picture";
