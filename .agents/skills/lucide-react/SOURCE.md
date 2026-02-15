# Lucide React Icons Usage Guide

## Package Information

**Package Name:** `lucide-react`  
**Import Pattern:** Named imports from `lucide-react`

## Basic Usage

### Importing Icons

```
import { IconName } from "lucide-react";
```

### Available Icon Categories

- **UI & Navigation:** Menu, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, Home, Settings, Search
- **Actions:** Plus, Minus, Edit, Trash2, Save, Download, Upload, Copy, Check, AlertCircle
- **Social & Communication:** Mail, Phone, MessageCircle, Send, User, Users, Heart, Share2
- **Files & Folders:** File, FileText, Folder, FolderOpen, Image, Video, Music
- **Business:** Calendar, Clock, DollarSign, ShoppingCart, CreditCard, TrendingUp, BarChart
- **Media Controls:** Play, Pause, SkipForward, SkipBack, Volume2, VolumeX

## Icon Props

All lucide-react icons accept the following props:

```
type TIconProps = {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
  absoluteStrokeWidth?: boolean;
};
```

## Component Integration Patterns

### Pattern 1: Direct Icon Usage

```
import { Search } from "lucide-react";

export const SearchButton = () => {
  return (
    <button className="flex items-center gap-2">
      <Search size={20} />
      <span>Search</span>
    </button>
  );
};
```

### Pattern 2: Icon as Prop

```
import { LucideIcon } from "lucide-react";

type TButtonProps = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
};

export const IconButton = ({ icon: Icon, label, onClick }: TButtonProps) => {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
};
```

### Pattern 3: Conditional Icon Rendering

```
import { Check, X, Loader2 } from "lucide-react";

type TStatusIconProps = {
  status: "success" | "error" | "loading";
};

export const StatusIcon = ({ status }: TStatusIconProps) => {
  const iconMap = {
    success: Check,
    error: X,
    loading: Loader2,
  };

  const Icon = iconMap[status];

  return (
    <Icon size={24} className={status === "loading" ? "animate-spin" : ""} />
  );
};
```

### Pattern 4: Icon with Dynamic Styling

```
import { Heart } from "lucide-react";
import { memo } from "react";

type TLikeButtonProps = {
  isLiked: boolean;
  onToggle: () => void;
};

export const LikeButton = memo(({ isLiked, onToggle }: TLikeButtonProps) => {
  return (
    <button onClick={onToggle}>
      <Heart
        size={24}
        fill={isLiked ? "red" : "none"}
        color={isLiked ? "red" : "currentColor"}
        strokeWidth={2}
      />
    </button>
  );
});
```

## Common Use Cases

### Navigation Menu

```
import { Home, User, Settings, LogOut } from "lucide-react";

export const NavigationMenu = () => {
  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: LogOut, label: "Logout", path: "/logout" },
  ];

  return (
    <nav>
      {menuItems.map(({ icon: Icon, label, path }) => (
        <a key={path} href={path} className="flex items-center gap-2">
          <Icon size={20} />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
};
```

### Form Input with Icon

```
import { Search, X } from "lucide-react";

type TSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
};

export const SearchInput = ({
  value,
  onChange,
  onClear,
}: TSearchInputProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={20} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};
```

### Alert Component

```
import { AlertCircle, CheckCircle, XCircle, Info } from "lucide-react";

type TAlertType = "info" | "success" | "warning" | "error";

type TAlertProps = {
  type: TAlertType;
  message: string;
};

export const Alert = ({ type, message }: TAlertProps) => {
  const config = {
    info: { icon: Info, color: "text-blue-500" },
    success: { icon: CheckCircle, color: "text-green-500" },
    warning: { icon: AlertCircle, color: "text-yellow-500" },
    error: { icon: XCircle, color: "text-red-500" },
  };

  const { icon: Icon, color } = config[type];

  return (
    <div className="flex items-center gap-3">
      <Icon className={color} size={24} />
      <span>{message}</span>
    </div>
  );
};
```

## Best Practices

1. **Consistent Sizing:** Use consistent icon sizes throughout your application (16, 20, 24px are common)
2. **Accessibility:** Always provide text labels or aria-labels when using icons alone
3. **Performance:** Import only the icons you need, not the entire library
4. **Type Safety:** Use `LucideIcon` type when passing icons as props
5. **Styling:** Use className prop for Tailwind classes, inline props for dynamic styling
6. **Animation:** Leverage existing animations like `animate-spin` for loading states

## Icon Reference Format

When generating components, use this format:

```
import { IconName } from "lucide-react";
```

Common icon name patterns:

- PascalCase naming (e.g., `ChevronDown`, `ArrowRight`)
- Descriptive names (e.g., `Trash2` for delete, `Edit` for edit)
- Number suffixes for variations (e.g., `FileText`, `Trash2`)

## Troubleshooting

**Issue:** Icon not displaying  
**Solution:** Verify icon name is correct and properly imported

**Issue:** Icon size too large/small  
**Solution:** Use size prop with number value (pixels)

**Issue:** Icon color not changing  
**Solution:** Use color prop or className with Tailwind text color utilities