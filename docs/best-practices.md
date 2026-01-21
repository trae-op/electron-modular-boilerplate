# React Best Practices Guide

## Core Principles

### Component Architecture

- Write components as arrow functions with memoization
- Break large components into smaller, focused units
- Each component should have a single responsibility
- Separate business logic from presentation using custom hooks
- Export components using named exports

### TypeScript Integration

- Use TypeScript for type safety across all components
- Define all types in a separate `types.ts` file
- Use `type` instead of `interface` for all type definitions
- Name types with a "T" prefix (e.g., `TComponentProps`, `TUserData`)
- Never use `FC` or `React.FC` type annotations
- Define props directly in component parameters

### State Management

- Extract all state logic into custom hooks
- Keep components pure and focused on rendering
- Return only necessary values from custom hooks
- Use meaningful names for custom hooks (e.g., `useUserAuthentication`, `useFormValidation`)

## Component Structure Pattern

```
const ComponentName = memo((props: TComponentNameProps) => {
  const hookData = useComponentLogic(props);

  return (
    <div>
      {hookData.content}
    </div>
  );
});

export { ComponentName };
```

## TypeScript Patterns

### Type Definitions

All types must be defined in `types.ts`:

```
type TUserProfile = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
};

type TButtonProps = {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
};

type TFormState = {
  values: Record<string, string>;
  errors: Record<string, string>;
  isSubmitting: boolean;
};
```

### Props Definition

Props should be defined directly in the component parameter:

```
const Button = memo((props: TButtonProps) => {
  return <button onClick={props.onClick}>{props.label}</button>;
});
```

## Custom Hooks Pattern

Extract all business logic, state management, and side effects into custom hooks:

```
const useFormLogic = (initialValues: TFormState) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = useCallback((field: string, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    if (!values.email) {
      newErrors.email = 'Email is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);
  
  return {
    values,
    errors,
    handleChange,
    validate
  };
};
```

## Component Composition

### Small, Focused Components

Break down complex UI into smaller pieces:

```
const UserCard = memo((props: TUserCardProps) => {
  const { user } = useUserCard(props);
  
  return (
    <Card>
      <UserAvatar user={user} />
      <UserInfo user={user} />
      <UserActions user={user} />
    </Card>
  );
});

const UserAvatar = memo((props: TUserAvatarProps) => {
  return (
    <div>
      <img src={props.user.avatarUrl} alt={props.user.name} />
    </div>
  );
});

const UserInfo = memo((props: TUserInfoProps) => {
  return (
    <div>
      <h3>{props.user.name}</h3>
      <p>{props.user.email}</p>
    </div>
  );
});
```

## Performance Optimization

### Memoization Strategy

- Use `memo` for all components to prevent unnecessary re-renders
  - **Large Component Trees:** When you have many small components and you want to save performance.
  - **Static or Slow Props:** When a component receives the same props very often.
  - **Following your rules:** You mentioned in your instructions: "Always use memorization of components." This helps keep your app very fast.
- Use `useMemo` for expensive computations
  - **Expensive Calculations:** When you have a very large list (e.g., 5,000 items) and you need to filter or sort it.
  - **Stable References:** In your coding rules, you use `memo` for components. If you pass an object or an array to a memoized component, you should use `useMemo`. If you don't, the child component will re-render every time.
- Use `useCallback` for function definitions passed as props
  - **To stop extra re-renders:** Because your coding rules say "Always use memorization of components," you need `useCallback`. If you pass a function to a `memo` component, you must wrap it in `useCallback`. If you don't, the `memo` component will re-render every time because the function reference changed.
  - **For useEffect:** If a function is inside the dependency array of a `useEffect`, you should use `useCallback` to prevent the effect from running too often.

```
const ExpensiveList = memo((props: TExpensiveListProps) => {
  const { items, filteredItems, handleItemClick } = useListLogic(props);
  
  return (
    <div>
      {filteredItems.map(item => (
        <ListItem 
          key={item.id} 
          item={item} 
          onClick={handleItemClick} 
        />
      ))}
    </div>
  );
});

const useListLogic = (props: TExpensiveListProps) => {
  const filteredItems = useMemo(() => {
    return props.items.filter(item => 
      item.name.toLowerCase().includes(props.searchQuery.toLowerCase())
    );
  }, [props.items, props.searchQuery]);
  
  const handleItemClick = useCallback((id: string) => {
    props.onItemSelect(id);
  }, [props.onItemSelect]);
  
  return {
    items: props.items,
    filteredItems,
    handleItemClick
  };
};
```

## State Management Patterns

### Local State with Custom Hooks

```
const useCounter = (initialValue: number = 0) => {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);
  
  const decrement = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);
  
  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);
  
  return {
    count,
    increment,
    decrement,
    reset
  };
};
```

### Complex State with Reducer

```
const useComplexState = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const actions = useMemo(() => ({
    addItem: (item: TItem) => dispatch({ type: 'ADD_ITEM', payload: item }),
    removeItem: (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id }),
    updateItem: (item: TItem) => dispatch({ type: 'UPDATE_ITEM', payload: item })
  }), []);
  
  return {
    state,
    actions
  };
};
```

## Data Fetching Patterns

### Custom Hook for API Calls

```
const useUserData = (userId: string) => {
  const [data, setData] = useState<TUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        setData(userData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [userId]);
  
  return { data, loading, error };
};
```

## Error Handling

### Error Boundary Component

```
const ErrorBoundary = memo((props: TErrorBoundaryProps) => {
  const { error, resetError } = useErrorBoundary();
  
  if (error) {
    return (
      <ErrorFallback 
        error={error} 
        onReset={resetError} 
      />
    );
  }
  
  return <>{props.children}</>;
});
```

## Form Handling

### Controlled Forms with Validation

```
const useFormValidation = (initialValues: TFormValues, validate: TValidationFn) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<TFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const handleChange = useCallback((field: string, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      const fieldErrors = validate({ ...values, [field]: value });
      setErrors(prev => ({ ...prev, [field]: fieldErrors[field] }));
    }
  }, [values, touched, validate]);
  
  const handleBlur = useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const fieldErrors = validate(values);
    setErrors(prev => ({ ...prev, [field]: fieldErrors[field] }));
  }, [values, validate]);
  
  const handleSubmit = useCallback(async (onSubmit: TSubmitHandler) => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      await onSubmit(values);
    }
  }, [values, validate]);
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit
  };
};
```

## Advanced Patterns

### Compound Components

```
const TabsContext = createContext<TTabsContext | null>(null);

const Tabs = memo((props: TTabsProps) => {
  const tabsData = useTabsLogic(props);
  
  return (
    <TabsContext.Provider value={tabsData}>
      <div>{props.children}</div>
    </TabsContext.Provider>
  );
});

const TabList = memo((props: TTabListProps) => {
  return <div role="tablist">{props.children}</div>;
});

const Tab = memo((props: TTabProps) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('Tab must be used within Tabs');
  }
  
  return (
    <button
      role="tab"
      onClick={() => context.selectTab(props.value)}
      aria-selected={context.activeTab === props.value}
    >
      {props.children}
    </button>
  );
});

Tabs.List = TabList;
Tabs.Tab = Tab;

export { Tabs };
```

### Render Props Pattern

```
const DataProvider = memo((props: TDataProviderProps) => {
  const data = useDataFetching(props.url);
  
  return <>{props.children(data)}</>;
});
```

### HOC Pattern (Use Sparingly)

```
const withAuthentication = <P extends object>(
  Component: ComponentType<P>
) => {
  return memo((props: P) => {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    return <Component {...props} />;
  });
};
```

## Code Organization

### File Structure

```architecture
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── index.ts
│   │   └── types.ts
│   └── Form/
│       ├── TextField.tsx
│       ├── index.ts
│       └── types.ts
└── hooks/
    └── general/
        ├── useActions.ts
        ├── index.ts
        └── types.ts
```

### Export Pattern

```
export { Button } from './Button';
export { Form } from './Form';
export { useAuth } from './hooks/useAuth';
```

## Testing Considerations

### Component Structure for Testability

- Keep components pure and predictable
- Isolate side effects in custom hooks
- Use dependency injection for external services
- Avoid deep prop drilling

```
const UserList = memo((props: TUserListProps) => {
  const { users, loading, error, refetch } = useUserList(props.fetchUsers);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
});
```

## Accessibility Best Practices

- Use semantic HTML elements
- Add ARIA attributes where necessary
- Ensure keyboard navigation works
- Maintain proper focus management
- Provide alternative text for images

```
const Modal = memo((props: TModalProps) => {
  const { isOpen, handleClose } = useModal(props);
  
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <h2 id="modal-title">{props.title}</h2>
      <div id="modal-description">{props.children}</div>
      <button onClick={handleClose} aria-label="Close modal">
        Close
      </button>
    </div>
  );
});
```

## Summary Checklist

- ✅ Use arrow functions for all components
- ✅ Wrap components with `memo`
- ✅ Define props directly in component parameters
- ✅ Extract all logic into custom hooks
- ✅ Use named exports
- ✅ Define types with "T" prefix in `types.ts`
- ✅ Use `type` instead of `interface`
- ✅ Break large components into smaller ones
- ✅ Apply `useCallback` and `useMemo` for optimization
- ✅ Avoid `FC` or `React.FC` annotations
- ✅ Keep components focused on presentation
- ✅ Implement proper error handling
- ✅ Follow accessibility guidelines
- ✅ Write testable, predictable code