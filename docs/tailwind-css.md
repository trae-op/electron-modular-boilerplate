# Tailwind CSS Styling Guidelines for React Components

## Core Principles

### 1. Component Customization Architecture

Every component must be designed with customization in mind using a consistent pattern that allows style overrides while maintaining default styling.

**Base Pattern:**

```
type TComponentProps = {
  className?: string;
  children?: React.ReactNode;
}

export const Component = memo(({ className = '', children }: TComponentProps) => {
  return (
    <div className={`default-base-styles ${className}`}>
      {children}
    </div>
  );
});
```

### 2. Style Merge Strategy

Use the className concatenation pattern where default styles are applied first, followed by custom className. This allows users to override specific utilities.

**Important:** The custom className comes last to enable Tailwind's cascade override behavior.

## Styling Best Practices

### 3. Responsive Design Patterns

Always implement mobile-first responsive design:

```
className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
```

**Breakpoint Usage:**
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up
- `2xl:` - 1536px and up

### 4. Spacing Consistency

Maintain consistent spacing using Tailwind's spacing scale:

**Common Patterns:**
- Component padding: `p-4 md:p-6 lg:p-8`
- Section margins: `mb-6 md:mb-8 lg:mb-12`
- Grid gaps: `gap-4 md:gap-6 lg:gap-8`

### 5. Color System

Implement semantic color naming through Tailwind utilities:

**Text Colors:**

```
text-gray-900 dark:text-gray-100
text-gray-600 dark:text-gray-400
text-blue-600 hover:text-blue-700
```

**Background Colors:**

```
bg-white dark:bg-gray-900
bg-gray-50 dark:bg-gray-800
bg-blue-500 hover:bg-blue-600
```

### 6. Typography Hierarchy

Establish clear typography patterns:

```
className="text-3xl md:text-4xl lg:text-5xl font-bold"
className="text-base md:text-lg leading-relaxed"
className="text-sm md:text-base text-gray-600"
```

**Font Weights:**
- Headings: `font-bold` or `font-semibold`
- Body text: `font-normal` or `font-medium`
- Subtle text: `font-light`

### 7. Interactive States

Always define hover, focus, and active states:

```
className="transition-colors duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 active:bg-gray-200"
```

**State Pattern:**

```
hover:state
focus:state
active:state
disabled:state
```

### 8. Layout Patterns

**Flexbox Layouts:**

```
className="flex items-center justify-between gap-4"
className="flex flex-col md:flex-row"
```

**Grid Layouts:**

```
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
className="grid grid-cols-[auto_1fr_auto] items-center"
```

### 9. Container Patterns

Standardize container widths:

```
className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8"
className="container mx-auto"
```

### 10. Animation and Transitions

Apply smooth transitions for better UX:

```
className="transition-all duration-300 ease-in-out"
className="transform hover:scale-105 transition-transform"
```

## Advanced Customization Patterns

### 11. Variant-Based Styling

Create components with variant support:

```
type TButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Button = memo(({ 
  variant = 'primary', 
  size = 'md', 
  className = '' 
}: TButtonProps) => {
  const baseStyles = 'font-medium rounded-lg transition-colors duration-200';
  
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
});
```

### 12. Composition Pattern

Build complex components from smaller styled primitives:

```
export const Card = memo(({ className = '', children }: TCardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
});

export const CardHeader = memo(({ className = '', children }: TCardHeaderProps) => {
  return (
    <div className={`mb-4 pb-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
});

export const CardBody = memo(({ className = '', children }: TCardBodyProps) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
});
```

### 13. Dark Mode Support

Always implement dark mode variants:

```
className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
className="border-gray-200 dark:border-gray-700"
className="shadow-lg dark:shadow-gray-800"
```

### 14. Accessibility Patterns

Ensure components are accessible:

```
className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
className="sr-only"
aria-label="descriptive label"
role="button"
tabIndex={0}
```

### 15. Performance Optimization

Use Tailwind utilities that leverage CSS custom properties for dynamic values sparingly. Prefer static utility classes.

**Avoid:**

```
style={{ width: `${dynamicValue}px` }}
```

**Prefer:**

```
className={dynamicValue > 50 ? 'w-full' : 'w-1/2'}
```

## Component Structure Template

```
type TComponentProps = {
  variant?: 'default' | 'alternative';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const Component = memo(({ 
  variant = 'default',
  size = 'md',
  disabled = false,
  className = '',
  children,
  onClick
}: TComponentProps) => {
  const baseStyles = 'base utility classes';
  const variantStyles = variant === 'default' ? 'default styles' : 'alternative styles';
  const sizeStyles = {
    sm: 'small size styles',
    md: 'medium size styles',
    lg: 'large size styles'
  }[size];
  const stateStyles = disabled ? 'disabled styles' : 'enabled styles';
  
  return (
    <div 
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${stateStyles} ${className}`}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </div>
  );
});
```

## Common Utility Combinations

### Buttons

```
base: "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500"
```

### Cards

```
base: "bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
bordered: "border border-gray-200"
interactive: "cursor-pointer hover:border-blue-500"
```

### Inputs

```
base: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200"
default: "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
error: "border-red-500 focus:border-red-500 focus:ring-red-500"
```

### Text Elements

```
heading: "text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100"
subheading: "text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200"
body: "text-base leading-relaxed text-gray-700 dark:text-gray-300"
caption: "text-sm text-gray-600 dark:text-gray-400"
```

## Naming Conventions

### Class Organization Order

Follow this order for better readability:
1. Layout (display, position, float)
2. Box model (width, height, margin, padding)
3. Typography (font, text, line-height)
4. Visual (background, border, shadow)
5. Transforms and transitions
6. State variants (hover, focus, active)
7. Responsive modifiers (sm:, md:, lg:)
8. Dark mode variants (dark:)

Example:

```
className="flex flex-col w-full max-w-md mx-auto p-6 text-base font-medium bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 md:p-8 dark:bg-gray-900 dark:border-gray-700"
```

## Testing Customization

Always verify that custom className props can successfully override default styles:

```
<Component 
  className="bg-red-500"
/>
```

Should properly override the default background color due to class order specificity.

## Summary Checklist

- Component accepts className prop
- Default styles are comprehensive and production-ready
- Responsive breakpoints are implemented
- Dark mode variants are included
- Interactive states (hover, focus, active) are defined
- Accessibility attributes are present
- Transitions are smooth (200-300ms)
- Typography follows hierarchy
- Spacing is consistent
- Custom className can override defaults
- Component is memoized
- Variants are implemented where appropriate
- All utilities follow the organization order