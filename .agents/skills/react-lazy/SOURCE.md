# React lazy() - Complete Guide

## Overview

`React.lazy()` enables code splitting by allowing you to render a dynamic import as a regular component. It automatically splits your bundle into smaller chunks that are loaded on demand.

## Basic Syntax

```
const Component = lazy(() => import('./Component'));
```

## Core Principles

### ✅ Correct Usage

```
const LazyModal = lazy(() => import('./Modal'));
const LazyDashboard = lazy(() => import('./Dashboard'));
const LazySettings = lazy(() => import('./pages/Settings'));
```

### ❌ Incorrect Usage

```
const LazyModal = lazy(() => Promise.resolve({ default: Modal }));
const LazyDashboard = lazy(() => import('./Dashboard').then(m => m.Dashboard));
```

**Why incorrect:**

- First example: Component already imported synchronously, no code splitting occurs
- Second example: Named imports should be handled differently (see below)

## Working with Named Exports

### Problem

```
export const Dashboard = () => { };
```

### Solution

```
const LazyDashboard = lazy(() =>
  import('./Dashboard').then(module => ({ default: module.Dashboard }))
);
```

### Better Solution - Use Default Exports

```
export default Dashboard;

const LazyDashboard = lazy(() => import('./Dashboard'));
```

## Suspense Integration

`lazy()` **requires** Suspense wrapper.

### Basic Pattern

```
<Suspense fallback={<Loader />}>
  <LazyComponent />
</Suspense>
```

### Multiple Components

```
<Suspense fallback={<Loader />}>
  <LazyHeader />
  <LazyContent />
  <LazyFooter />
</Suspense>
```

### Nested Suspense

```
<Suspense fallback={<PageLoader />}>
  <Header />
  <Suspense fallback={<ContentLoader />}>
    <LazyContent />
  </Suspense>
  <Footer />
</Suspense>
```

## Best Practices

### 1. Route-Based Code Splitting

**✅ Good - Split by routes**

```
const LazyHome = lazy(() => import('./pages/Home'));
const LazyAbout = lazy(() => import('./pages/About'));
const LazyProfile = lazy(() => import('./pages/Profile'));

const App = () => (
  <Router>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LazyHome />} />
        <Route path="/about" element={<LazyAbout />} />
        <Route path="/profile" element={<LazyProfile />} />
      </Routes>
    </Suspense>
  </Router>
);
```

### 2. Modal and Dialog Components

**✅ Good - Lazy load modals**

```
const LazyConfirmModal = lazy(() => import('./modals/ConfirmModal'));
const LazyUserEditModal = lazy(() => import('./modals/UserEditModal'));

export const Dashboard = memo((props: TDashboard) => {
  const { isModalOpen } = useDashboard();

  return (
    <div>
      <Content />
      {isModalOpen && (
        <Suspense fallback={<ModalSkeleton />}>
          <LazyConfirmModal />
        </Suspense>
      )}
    </div>
  );
});
```

### 3. Tab-Based Content

**✅ Good - Split tabs**

```
const LazyOverviewTab = lazy(() => import('./tabs/OverviewTab'));
const LazyAnalyticsTab = lazy(() => import('./tabs/AnalyticsTab'));
const LazySettingsTab = lazy(() => import('./tabs/SettingsTab'));

export const Dashboard = memo((props: TDashboard) => {
  const { activeTab } = useDashboard();

  return (
    <Suspense fallback={<TabLoader />}>
      {activeTab === 'overview' && <LazyOverviewTab />}
      {activeTab === 'analytics' && <LazyAnalyticsTab />}
      {activeTab === 'settings' && <LazySettingsTab />}
    </Suspense>
  );
});
```

### 4. Heavy Third-Party Libraries

**✅ Good - Lazy load heavy dependencies**

```
const LazyChart = lazy(() => import('./components/Chart'));
const LazyMarkdownEditor = lazy(() => import('./components/MarkdownEditor'));
const LazyCodeEditor = lazy(() => import('./components/CodeEditor'));
```

### 5. Conditional Features

**✅ Good - Admin-only features**

```
const LazyAdminPanel = lazy(() => import('./admin/AdminPanel'));

export const App = memo((props: TApp) => {
  const { isAdmin } = useApp();

  return (
    <div>
      <MainContent />
      {isAdmin && (
        <Suspense fallback={<AdminLoader />}>
          <LazyAdminPanel />
        </Suspense>
      )}
    </div>
  );
});
```

## When NOT to Use lazy()

### ❌ Small Components

```
const LazyButton = lazy(() => import('./Button'));
const LazyIcon = lazy(() => import('./Icon'));
```

**Why:** Overhead of code splitting exceeds benefits for tiny components.

### ❌ Above-the-Fold Content

```
const LazyHeader = lazy(() => import('./Header'));
const LazyHero = lazy(() => import('./Hero'));
```

**Why:** Critical content should load immediately, not delayed.

### ❌ Components Used on Every Page

```
const LazyNavigation = lazy(() => import('./Navigation'));
const LazyFooter = lazy(() => import('./Footer'));
```

**Why:** No benefit if component loads on every route anyway.

### ❌ Already Imported Components

```
import { Modal } from './Modal';

const LazyModal = lazy(() => Promise.resolve({ default: Modal }));
```

**Why:** Component already in bundle, creates unnecessary complexity.

## Advanced Patterns

### 1. Prefetching

```
const LazySettings = lazy(() => import('./Settings'));

const prefetchSettings = () => {
  import('./Settings');
};

export const Dashboard = memo((props: TDashboard) => (
  <div>
    <button onMouseEnter={prefetchSettings}>
      Settings
    </button>
  </div>
));
```

### 2. Error Boundaries

```
type TErrorBoundary = {
  children: ReactNode;
};

class ErrorBoundary extends Component<TErrorBoundary> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}

const App = () => (
  <ErrorBoundary>
    <Suspense fallback={<Loader />}>
      <LazyComponent />
    </Suspense>
  </ErrorBoundary>
);
```

### 3. Retry Logic

```
const retryImport = (importFn: () => Promise<any>, retries = 3) => {
  return importFn().catch(error => {
    if (retries > 0) {
      return retryImport(importFn, retries - 1);
    }
    throw error;
  });
};

const LazyComponent = lazy(() =>
  retryImport(() => import('./Component'))
);
```

### 4. Named Exports with Re-export

```
export { Dashboard } from './Dashboard';

const LazyDashboard = lazy(() =>
  import('./Dashboard').then(m => ({ default: m.Dashboard }))
);
```

**Better approach - create barrel file:**

```
export { default } from './Dashboard';

const LazyDashboard = lazy(() => import('./Dashboard'));
```

## Performance Optimization

### Bundle Size Guidelines

- Split when component > 50KB
- Split route-level components
- Split admin/premium features
- Split components with heavy dependencies

### Suspense Placement Strategy

```
<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/" element={<LazyHome />} />
    <Route path="/dashboard" element={
      <Suspense fallback={<DashboardLoader />}>
        <LazyDashboard />
      </Suspense>
    } />
  </Routes>
</Suspense>
```

## TypeScript Integration

### Component Types

```
type TLazyComponent = {
  data: string[];
  onAction: (id: string) => void;
};

const LazyComponent = lazy(() => import('./Component'));

export const Parent = memo((props: TParent) => (
  <Suspense fallback={<Loader />}>
    <LazyComponent data={props.items} onAction={props.handleAction} />
  </Suspense>
));
```

### Type-Safe Imports

```
type TComponentModule = {
  Component: ComponentType<TComponent>;
};

const LazyComponent = lazy(() =>
  import('./Component').then((m: TComponentModule) => ({
    default: m.Component
  }))
);
```

## Common Pitfalls

### 1. Missing Suspense

```
const LazyModal = lazy(() => import('./Modal'));

<LazyModal />
```

**Error:** Component suspended while rendering, but no fallback UI was specified.

### 2. Suspense Inside lazy()

```
const LazyComponent = lazy(() => import('./Component'));

export const Wrapper = () => (
  <LazyComponent />
);
```

**Missing Suspense at parent level.**

### 3. Conditional lazy()

```
const Component = isLazy
  ? lazy(() => import('./Component'))
  : RegularComponent;
```

**Error:** lazy() must be called unconditionally at module level.

## Decision Tree

```
Should I use lazy()?
├─ Is component > 50KB? → YES → Use lazy()
├─ Is it route-based? → YES → Use lazy()
├─ Is it modal/dialog? → YES → Use lazy()
├─ Is it admin/premium only? → YES → Use lazy()
├─ Is it tab content? → YES → Use lazy()
├─ Has heavy dependencies? → YES → Use lazy()
├─ Above-the-fold content? → NO → Don't use lazy()
├─ Used on every page? → NO → Don't use lazy()
├─ Small utility component? → NO → Don't use lazy()
└─ Already imported? → NO → Don't use lazy()
```

## Summary

**Use lazy() when:**

- Route-level components
- Modals, dialogs, drawers
- Tab content not immediately visible
- Admin or premium features
- Components with heavy third-party libraries
- Conditional features based on user role

**Don't use lazy() when:**

- Component is small (< 50KB)
- Component is critical for initial render
- Component is used on every page
- Component is already synchronously imported

**Always remember:**

- `lazy()` requires Suspense
- Use default exports for cleaner syntax
- Place Suspense strategically for better UX
- Consider prefetching for better performance
