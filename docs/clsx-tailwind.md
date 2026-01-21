# React Component Styling Instructions

## Overview

This document provides instructions for generating React components with proper styling using `clsx` and `tailwind-merge` packages. These tools enable conditional and merged Tailwind CSS classes with optimal performance.

## Core Utility Function

All components must use the `cn` utility function for className management:

```
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
```

**Location**: This function should be placed in `src\renderer\utils\classes.ts`

## Usage Patterns

### Basic Component Styling

```
import { cn } from "@utils/classes";

export const Button = ({ className, ...props }: TButtonProps) => {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md bg-blue-500 text-white",
        className
      )}
      {...props}
    />
  );
};
```

### Conditional Styling

```
import { cn } from "@utils/classes";

export const Alert = ({ variant, className, ...props }: TAlertProps) => {
  return (
    <div
      className={cn(
        "p-4 rounded-lg border",
        variant === "error" && "bg-red-50 border-red-500 text-red-900",
        variant === "success" && "bg-green-50 border-green-500 text-green-900",
        variant === "warning" && "bg-yellow-50 border-yellow-500 text-yellow-900",
        className
      )}
      {...props}
    />
  );
};
```

### Complex Conditional Logic

```
import { cn } from "@utils/classes";

export const Card = ({
  elevated,
  interactive,
  disabled,
  className,
  ...props
}: TCardProps) => {
  return (
    <div
      className={cn(
        "rounded-lg border bg-white p-6",
        elevated && "shadow-lg",
        interactive && "cursor-pointer hover:shadow-xl transition-shadow",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      {...props}
    />
  );
};
```

### Object-based Conditionals

```
import { cn } from "@utils/classes";

export const Badge = ({ size, variant, className, ...props }: TBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        {
          "px-2 py-1 text-xs": size === "sm",
          "px-3 py-1.5 text-sm": size === "md",
          "px-4 py-2 text-base": size === "lg",
        },
        {
          "bg-gray-100 text-gray-800": variant === "default",
          "bg-blue-100 text-blue-800": variant === "primary",
          "bg-red-100 text-red-800": variant === "danger",
        },
        className
      )}
      {...props}
    />
  );
};
```

## Key Benefits

### 1. Tailwind Conflict Resolution

`twMerge` automatically resolves conflicting Tailwind classes:

```
cn("px-4 py-2", "px-6")
```

Results in: `"py-2 px-6"` (later `px-6` overrides `px-4`)

### 2. Conditional Class Application

`clsx` handles conditional logic efficiently:

```
cn(
  "base-class",
  condition && "conditional-class",
  { "object-class": anotherCondition }
)
```

### 3. className Prop Override

Always accept `className` as the last parameter to allow component consumers to override styles:

```
export const Component = ({ className, ...props }: TProps) => {
  return (
    <div className={cn("default-classes", className)} {...props} />
  );
};
```

## Component Structure Template

```
import { memo } from "react";
import { cn } from "@utils/classes";
import type { TComponentProps } from "./types";

export const Component = memo(({
  variant = "default",
  size = "md",
  disabled = false,
  className,
  children,
  ...props
}: TComponentProps) => {
  return (
    <div
      className={cn(
        "base-classes",
        variant === "primary" && "variant-classes",
        size === "lg" && "size-classes",
        disabled && "disabled-classes",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Component.displayName = "Component";
```

## Best Practices

1. **Always use `cn` utility** - Never concatenate className strings manually
2. **Base classes first** - Place default/base classes as the first argument
3. **Conditionals in order** - Order conditional classes logically (variant → size → state)
4. **className prop last** - Always place the `className` prop as the final argument for override capability
5. **Extract complex logic** - For very complex conditional logic, consider computing className in a separate variable
6. **Memoization** - Use `memo` for components to prevent unnecessary re-renders
7. **Type safety** - Define prop types in separate `types.ts` file

## Anti-patterns to Avoid

❌ **String concatenation**

```
className={`base-class ${condition ? "conditional" : ""} ${className}`}
```

❌ **Manual conflict resolution**

```
className={condition ? "px-4" : "px-6"}
```

❌ **Inline ternaries without cn**

```
className={isActive ? "bg-blue-500" : "bg-gray-500"}
```

✅ **Correct approach**

```
className={cn("base-class", condition && "conditional", className)}
```

## Summary

When generating components:

1. Import `cn` from utils
2. Define base Tailwind classes
3. Add conditional classes using logical operators or objects
4. Always accept and merge `className` prop as the final argument
5. Use TypeScript types from separate `types.ts` file
6. Wrap components with `memo` for optimization
